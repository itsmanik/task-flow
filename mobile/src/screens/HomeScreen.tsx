import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import {
  deleteTask,
  getTasks,
  updateTask,
  Task,
} from '../services/taskService';
import {useAuth} from '../context/AuthContext';

type Filter = 'all' | 'active' | 'completed';

function HomeScreen() {
  const {logout} = useAuth();
  const navigation = useNavigation<any>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error: any) {
      Alert.alert(
        'Unable to load tasks',
        error.response?.data?.message || 'Please try again.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const updatedTask = await updateTask(task._id, {
        completed: !task.completed,
      });

      setTasks(currentTasks =>
        currentTasks.map(currentTask =>
          currentTask._id === updatedTask._id
            ? updatedTask
            : currentTask,
        ),
      );
    } catch (error: any) {
      Alert.alert(
        'Unable to update task',
        error.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    }
  };

  const handleEditTask = (task: Task) => {
    navigation.navigate('EditTask', {
      task,
    });
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      'Delete task?',
      `"${task.title}" will be permanently deleted.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task._id);

              setTasks(currentTasks =>
                currentTasks.filter(
                  currentTask => currentTask._id !== task._id,
                ),
              );
            } catch (error: any) {
              Alert.alert(
                'Unable to delete task',
                error.response?.data?.message ||
                  'Something went wrong. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'active') {
      return tasks.filter(task => !task.completed);
    }

    if (filter === 'completed') {
      return tasks.filter(task => task.completed);
    }

    return tasks;
  }, [tasks, filter]);

  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = tasks.length - completedTasks;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              Good morning 👋
            </Text>

            <Text style={styles.title}>
              Let's get things done.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.avatar}
            onPress={logout}>
            <Text style={styles.avatarText}>M</Text>
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressLabel}>
                Today's Progress
              </Text>

              <Text style={styles.progressNumber}>
                {progress}%
              </Text>
            </View>

            <Text style={styles.progressEmoji}>
              🚀
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {width: `${progress}%`},
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {completedTasks} of {tasks.length} tasks completed
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {tasks.length}
            </Text>

            <Text style={styles.statLabel}>
              Total
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {activeTasks}
            </Text>

            <Text style={styles.statLabel}>
              Active
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {completedTasks}
            </Text>

            <Text style={styles.statLabel}>
              Done
            </Text>
          </View>
        </View>

        {/* Tasks header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Your Tasks
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateTask')
            }>
            <Text style={styles.seeAll}>
              + Add
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          {(['all', 'active', 'completed'] as Filter[]).map(
            option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterButton,
                  filter === option &&
                    styles.filterButtonActive,
                ]}
                onPress={() => setFilter(option)}>
                <Text
                  style={[
                    styles.filterText,
                    filter === option &&
                      styles.filterTextActive,
                  ]}>
                  {option.charAt(0).toUpperCase() +
                    option.slice(1)}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        {/* Task content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#635BFF"
            />

            <Text style={styles.loadingText}>
              Loading your tasks...
            </Text>
          </View>
        ) : filteredTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              {filter === 'completed' ? '✓' : '✨'}
            </Text>

            <Text style={styles.emptyTitle}>
              {filter === 'all'
                ? "You're all clear"
                : filter === 'active'
                ? 'No active tasks'
                : 'Nothing completed yet'}
            </Text>

            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'Create your first task and start building your productive day.'
                : filter === 'active'
                ? 'Nice! You have no unfinished tasks.'
                : 'Complete some tasks and they will appear here.'}
            </Text>

            {filter !== 'completed' && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  navigation.navigate('CreateTask')
                }>
                <Text style={styles.addButtonText}>
                  + Create Task
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.taskList}>
            {filteredTasks.map(task => (
              <TouchableOpacity
                key={task._id}
                style={[
                  styles.taskCard,
                  task.completed &&
                    styles.completedCard,
                ]}
                onPress={() => handleEditTask(task)}
                onLongPress={() =>
                  handleDeleteTask(task)
                }
                activeOpacity={0.8}>

                <View style={styles.taskTop}>

                  {/* Checkbox */}
                  <TouchableOpacity
                    style={styles.checkboxButton}
                    onPress={() =>
                      handleToggleTask(task)
                    }
                    activeOpacity={0.8}>
                    <View style={styles.checkCircle}>
                      {task.completed ? (
                        <Text style={styles.checkText}>
                          ✓
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>

                  {/* Task details */}
                  <View
                    style={styles.taskTitleContainer}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed &&
                          styles.completedTitle,
                      ]}>
                      {task.title}
                    </Text>

                    {task.description ? (
                      <Text
                        style={styles.taskDescription}
                        numberOfLines={2}>
                        {task.description}
                      </Text>
                    ) : null}
                  </View>

                  {/* Priority */}
                  <View
                    style={[
                      styles.priorityDot,
                      task.priority === 'high'
                        ? styles.highPriority
                        : task.priority ===
                          'medium'
                        ? styles.mediumPriority
                        : styles.lowPriority,
                    ]}
                  />
                </View>

                <View style={styles.taskFooter}>
                  <Text style={styles.deadline}>
                    Due:{' '}
                    {new Date(
                      task.deadline,
                    ).toLocaleString()}
                  </Text>

                  <Text
                    style={[
                      styles.status,
                      task.completed
                        ? styles.completedStatus
                        : styles.activeStatus,
                    ]}>
                    {task.completed
                      ? '✓ Completed'
                      : '● Active'}
                  </Text>
                </View>

                <Text style={styles.deleteHint}>
                  Hold to delete
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Floating add */}
        <TouchableOpacity
          style={styles.floatingAddButton}
          onPress={() =>
            navigation.navigate('CreateTask')
          }>
          <Text style={styles.floatingAddText}>
            +
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}>
          <Text style={styles.logoutText}>
            Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  greeting: {
    fontSize: 15,
    color: '#737780',
    marginBottom: 5,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#17181C',
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#635BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  progressCard: {
    backgroundColor: '#635BFF',
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    color: '#DCD9FF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },

  progressNumber: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },

  progressEmoji: {
    fontSize: 34,
  },

  progressTrack: {
    height: 8,
    backgroundColor: '#817AFF',
    borderRadius: 10,
    marginTop: 18,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },

  progressText: {
    color: '#E8E6FF',
    fontSize: 13,
    marginTop: 12,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECF1',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#17181C',
  },

  statLabel: {
    fontSize: 12,
    color: '#858891',
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#17181C',
  },

  seeAll: {
    color: '#635BFF',
    fontWeight: '700',
    fontSize: 14,
  },

  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ECECF3',
    borderRadius: 13,
    padding: 4,
    marginBottom: 16,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },

  filterButtonActive: {
    backgroundColor: '#FFFFFF',
  },

  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#858891',
  },

  filterTextActive: {
    color: '#635BFF',
  },

  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },

  loadingText: {
    color: '#737780',
    marginTop: 12,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 26,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECF1',
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EEEDFF',
    color: '#635BFF',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#17181C',
    marginBottom: 8,
  },

  emptyText: {
    textAlign: 'center',
    color: '#737780',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },

  addButton: {
    backgroundColor: '#635BFF',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },

  taskList: {
    gap: 12,
  },

  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECECF1',
  },

  completedCard: {
    opacity: 0.72,
  },

  taskTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  checkboxButton: {
    marginRight: 12,
  },

  checkCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#D6D7DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },

  checkText: {
    color: '#635BFF',
    fontSize: 16,
    fontWeight: '800',
  },

  taskTitleContainer: {
    flex: 1,
    paddingRight: 10,
  },

  taskTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#17181C',
  },

  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#858891',
  },

  taskDescription: {
    color: '#737780',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  priorityDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    marginTop: 5,
  },

  highPriority: {
    backgroundColor: '#E05252',
  },

  mediumPriority: {
    backgroundColor: '#E5A52F',
  },

  lowPriority: {
    backgroundColor: '#4BAA72',
  },

  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },

  deadline: {
    color: '#737780',
    fontSize: 11,
    flex: 1,
  },

  status: {
    fontSize: 11,
    fontWeight: '700',
  },

  completedStatus: {
    color: '#4BAA72',
  },

  activeStatus: {
    color: '#635BFF',
  },

  deleteHint: {
    color: '#B0B2B9',
    fontSize: 10,
    marginTop: 8,
  },

  floatingAddButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#635BFF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    elevation: 5,
  },

  floatingAddText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '400',
    lineHeight: 34,
  },

  logoutButton: {
    alignItems: 'center',
    marginTop: 30,
  },

  logoutText: {
    color: '#E05252',
    fontWeight: '700',
  },
});

export default HomeScreen;