import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth } from 'date-fns';

export function useDashboard(selectedDate = new Date()) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [blockTasks, setBlockTasks] = useState({});
  const [dailyEntry, setDailyEntry] = useState(null);
  const [completions, setCompletions] = useState({});
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [weekData, setWeekData] = useState({});
  const [stats, setStats] = useState({
    streak: 0,
    weekScore: 0,
    monthTotal: 0,
    todayProgress: 0
  });

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const journalDebounceRef = useRef({});

  // Load time blocks and tasks
  useEffect(() => {
    if (!user) return;
    loadTimeBlocks();
  }, [user]);

  // Load daily entry and completions
  useEffect(() => {
    if (!user) return;
    loadDailyEntry();
  }, [user, dateKey]);

  // Calculate stats
  useEffect(() => {
    if (!user) return;
    calculateStats();
  }, [user, completions, dateKey]);

  const loadTimeBlocks = async () => {
    try {
      const { data: blocks, error } = await supabase
        .from('time_blocks')
        .select('*')
        .eq('user_id', user.id)
        .order('position');

      if (error) throw error;

      if (blocks && blocks.length > 0) {
        setTimeBlocks(blocks);
        await loadBlockTasks(blocks);
      } else {
        // Initialize with default blocks
        await initializeDefaultBlocks();
      }
    } catch (error) {
      console.error('Error loading time blocks:', error);
      setLoading(false); // ✅ Fixed: ensure loading clears on error
    }
  };

  const loadBlockTasks = async (blocks) => {
    try {
      const { data: tasks, error } = await supabase
        .from('block_tasks')
        .select('*')
        .in('time_block_id', blocks.map(b => b.id))
        .order('position');

      if (error) throw error;

      const tasksByBlock = {};
      tasks?.forEach(task => {
        if (!tasksByBlock[task.time_block_id]) {
          tasksByBlock[task.time_block_id] = [];
        }
        tasksByBlock[task.time_block_id].push(task);
      });

      setBlockTasks(tasksByBlock);
    } catch (error) {
      console.error('Error loading block tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyEntry = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', dateKey)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setDailyEntry(data);
        await loadCompletions(data.id);
      } else {
        // Create new entry for today
        const { data: newEntry, error: insertError } = await supabase
          .from('daily_entries')
          .insert({
            user_id: user.id,
            entry_date: dateKey
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setDailyEntry(newEntry);
        setCompletions({});
      }
    } catch (error) {
      console.error('Error loading daily entry:', error);
    }
  };

  const loadCompletions = async (entryId) => {
    try {
      const { data, error } = await supabase
        .from('task_completions')
        .select('*')
        .eq('daily_entry_id', entryId);

      if (error) throw error;

      const completionMap = {};
      data?.forEach(comp => {
        completionMap[comp.block_task_id] = comp.completed;
      });

      setCompletions(completionMap);
    } catch (error) {
      console.error('Error loading completions:', error);
    }
  };

  const toggleTask = async (taskId, completed) => {
    if (!dailyEntry) return;

    // Optimistic update
    setCompletions(prev => ({ ...prev, [taskId]: completed }));

    try {
      const { error } = await supabase
        .from('task_completions')
        .upsert({
          daily_entry_id: dailyEntry.id,
          block_task_id: taskId,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        }, {
          onConflict: 'daily_entry_id,block_task_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling task:', error);
      // Revert optimistic update on failure
      setCompletions(prev => ({ ...prev, [taskId]: !completed }));
    }
  };

  // ✅ Fixed: update local state IMMEDIATELY, then debounce DB write
  const updateJournal = useCallback((field, value) => {
    if (!dailyEntry) return;

    // Update local state immediately for responsive typing
    setDailyEntry(prev => ({ ...prev, [field]: value }));
    setSaveStatus('saving');

    // Clear any pending debounce for this field
    if (journalDebounceRef.current[field]) {
      clearTimeout(journalDebounceRef.current[field]);
    }

    // Debounce the DB write by 600ms
    journalDebounceRef.current[field] = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('daily_entries')
          .update({ [field]: value })
          .eq('id', dailyEntry.id);

        if (error) throw error;
        setSaveStatus('saved');

        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Error updating journal:', error);
        setSaveStatus('idle');
      }
    }, 600);
  }, [dailyEntry]);

  const loadWeekData = async (allTasks) => {
    try {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const totalTasks = allTasks.length;
      if (totalTasks === 0) return;

      const result = {};

      for (let i = 0; i < 7; i++) {
        const day = addDays(weekStart, i);
        const key = format(day, 'yyyy-MM-dd');

        const { data: entry } = await supabase
          .from('daily_entries')
          .select('id')
          .eq('user_id', user.id)
          .eq('entry_date', key)
          .maybeSingle();

        if (entry) {
          const { data: comps } = await supabase
            .from('task_completions')
            .select('completed')
            .eq('daily_entry_id', entry.id)
            .eq('completed', true);

          result[key] = { completed: totalTasks > 0 ? (comps?.length || 0) / totalTasks : 0 };
        } else {
          result[key] = { completed: 0 };
        }
      }

      setWeekData(result);
    } catch (error) {
      console.error('Error loading week data:', error);
    }
  };

  const calculateStats = async () => {
    try {
      // Calculate total tasks
      const allTasks = Object.values(blockTasks).flat();
      const totalTasks = allTasks.length;
      const completedTasks = allTasks.filter(task => completions[task.id]).length;
      const todayProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Load week data for WeekView component
      await loadWeekData(allTasks);

      // Calculate streak
      const streak = await calculateStreak();

      // Calculate week score
      const weekScore = await calculateWeekScore();

      // Calculate month total
      const monthTotal = await calculateMonthTotal();

      setStats({
        streak,
        weekScore,
        monthTotal,
        todayProgress
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const calculateStreak = async () => {
    let streak = 0;
    let checkDate = new Date();
    const allTasks = Object.values(blockTasks).flat();
    if (allTasks.length === 0) return 0;
    const threshold = Math.floor(allTasks.length * 0.8);
    const MAX_STREAK = 365; // ✅ Fixed: safety cap to prevent infinite loop

    while (streak < MAX_STREAK) {
      const key = format(checkDate, 'yyyy-MM-dd');
      const { data: entry } = await supabase
        .from('daily_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('entry_date', key)
        .maybeSingle();

      if (!entry) break;

      const { data: comps } = await supabase
        .from('task_completions')
        .select('completed')
        .eq('daily_entry_id', entry.id)
        .eq('completed', true);

      if (comps && comps.length >= threshold) {
        streak++;
        checkDate = addDays(checkDate, -1);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateWeekScore = async () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const allTasks = Object.values(blockTasks).flat();
    if (allTasks.length === 0) return 0;
    let totalPossible = 0;
    let totalCompleted = 0;

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      if (day > new Date()) break;

      const key = format(day, 'yyyy-MM-dd');
      const { data: entry } = await supabase
        .from('daily_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('entry_date', key)
        .maybeSingle();

      totalPossible += allTasks.length;

      if (entry) {
        const { data: comps } = await supabase
          .from('task_completions')
          .select('completed')
          .eq('daily_entry_id', entry.id)
          .eq('completed', true);

        totalCompleted += comps?.length || 0;
      }
    }

    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  };

  const calculateMonthTotal = async () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const allTasks = Object.values(blockTasks).flat();
    if (allTasks.length === 0) return 0;
    const threshold = Math.floor(allTasks.length * 0.8);

    const { data: entries } = await supabase
      .from('daily_entries')
      .select('id, entry_date')
      .eq('user_id', user.id)
      .gte('entry_date', format(monthStart, 'yyyy-MM-dd'))
      .lte('entry_date', format(monthEnd, 'yyyy-MM-dd'));

    if (!entries) return 0;

    let count = 0;
    for (const entry of entries) {
      const { data: comps } = await supabase
        .from('task_completions')
        .select('completed')
        .eq('daily_entry_id', entry.id)
        .eq('completed', true);

      if (comps && comps.length >= threshold) {
        count++;
      }
    }

    return count;
  };

  const initializeDefaultBlocks = async () => {
    const defaultBlocks = [
      {
        name: 'Spiritual anchor',
        color: '#1D9E75',
        start_time: '5:40',
        end_time: '6:20',
        position: 0,
        tasks: [
          'Prayer (structured, not rushed)',
          'Scripture reading — small but deep',
          'Silence 10–15 min',
          'Journal: 3 alignment questions',
          'No phone for first 60–90 min'
        ]
      },
      {
        name: 'Physical training',
        color: '#378ADD',
        start_time: '6:20',
        end_time: '7:10',
        position: 1,
        tasks: [
          'Strength training or brisk walk/run',
          'No entertainment during training',
          'Body as discipline, not just fitness'
        ]
      },
      {
        name: 'Deep work block 1',
        color: '#7F77DD',
        start_time: '8:30',
        end_time: '12:30',
        position: 2,
        tasks: [
          'Phone away / blocked',
          '90 min focus → 10 min break',
          'Tangible output produced',
          'Core product/startup/research work'
        ]
      },
      {
        name: 'Midday reset',
        color: '#D85A30',
        start_time: '12:30',
        end_time: '1:30',
        position: 3,
        tasks: [
          'Eat a real meal',
          'Walk — clear mental fog',
          'Reflect: what moved forward?',
          'No phone rabbit holes'
        ]
      },
      {
        name: 'Deep work block 2',
        color: '#7F77DD',
        start_time: '1:30',
        end_time: '4:30',
        position: 4,
        tasks: [
          'Alternate focus from morning',
          'Technical mastery or system design',
          'Writing / strategy / product design'
        ]
      },
      {
        name: 'Strategy layer',
        color: '#BA7517',
        start_time: '4:30',
        end_time: '6:00',
        position: 5,
        tasks: [
          'Deep reading (not scrolling)',
          'Study builders: case studies, patterns',
          'Work on long-term plan',
          'Weekly rotation focus'
        ]
      },
      {
        name: 'Daily review',
        color: '#5F5E5A',
        start_time: '7:30',
        end_time: '8:30',
        position: 6,
        tasks: [
          'What did I build today?',
          'What did I avoid?',
          'Did I stay aligned with mission?',
          'What must change tomorrow?'
        ]
      },
      {
        name: 'Spiritual closure',
        color: '#1D9E75',
        start_time: '8:30',
        end_time: '9:00',
        position: 7,
        tasks: [
          'Evening prayer',
          'Gratitude: 3 things',
          'Release the day mentally',
          'No screens after 9pm'
        ]
      }
    ];

    try {
      for (const blockData of defaultBlocks) {
        const { tasks, ...blockInfo } = blockData;
        
        const { data: block, error: blockError } = await supabase
          .from('time_blocks')
          .insert({ ...blockInfo, user_id: user.id })
          .select()
          .single();

        if (blockError) throw blockError;

        const tasksToInsert = tasks.map((task, i) => ({
          time_block_id: block.id,
          task_text: task,
          position: i
        }));

        const { error: tasksError } = await supabase
          .from('block_tasks')
          .insert(tasksToInsert);

        if (tasksError) throw tasksError;
      }

      // Reload after initialization
      await loadTimeBlocks();
    } catch (error) {
      console.error('Error initializing default blocks:', error);
      setLoading(false);
    }
  };

  return {
    loading,
    timeBlocks,
    blockTasks,
    dailyEntry,
    completions,
    stats,
    weekData,
    saveStatus,
    toggleTask,
    updateJournal,
    refreshData: loadTimeBlocks
  };
}
