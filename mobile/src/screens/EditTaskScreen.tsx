import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {updateTask, Task} from '../services/taskService';

type RootStackParamList = {
  Home: undefined;
  EditTask: {
    task: Task;
  };
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'EditTask'
>;

function EditTaskScreen({route, navigation}: Props) {
  const {task} = route.params;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description || '',
  );

  const [priority, setPriority] = useState<
    'low' | 'medium' | 'high'
  >(task.priority);

  const [deadline, setDeadline] = useState(
    new Date(task.deadline),
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(
        'Missing title',
        'Please enter a title for your task.',
      );
      return;
    }

    try {
      setLoading(true);

      await updateTask(task._id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        deadline: deadline.toISOString(),
      });

      Alert.alert('Task updated', 'Your changes have been saved.', [
        {
          text: 'Done',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Unable to update task',
        error.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = deadline.toLocaleDateString(
    undefined,
    {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  );

  const formattedTime = deadline.toLocaleTimeString(
    undefined,
    {
      hour: 'numeric',
      minute: '2-digit',
    },
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }>
        <View style={styles.content}>
          <Text style={styles.title}>Edit Task</Text>

          <Text style={styles.subtitle}>
            Update the details of your task.
          </Text>

          {/* Title */}
          <Text style={styles.label}>Title</Text>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="What needs to be done?"
            placeholderTextColor="#A5A6AE"
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add some details..."
            placeholderTextColor="#A5A6AE"
            multiline
            textAlignVertical="top"
          />

          {/* Priority */}
          <Text style={styles.label}>Priority</Text>

          <View style={styles.priorityRow}>
            {(['low', 'medium', 'high'] as const).map(
              level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priorityButton,
                    priority === level &&
                      styles.priorityButtonActive,
                  ]}
                  onPress={() => setPriority(level)}
                  activeOpacity={0.8}>
                  <View
                    style={[
                      styles.priorityDot,
                      level === 'low' &&
                        styles.lowDot,
                      level === 'medium' &&
                        styles.mediumDot,
                      level === 'high' &&
                        styles.highDot,
                    ]}
                  />

                  <Text
                    style={[
                      styles.priorityText,
                      priority === level &&
                        styles.priorityTextActive,
                    ]}>
                    {level.charAt(0).toUpperCase() +
                      level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>

          {/* Deadline */}
          <Text style={styles.label}>Deadline</Text>

          <View style={styles.deadlineRow}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}>
              <Text style={styles.dateIcon}>📅</Text>

              <View>
                <Text style={styles.dateLabel}>Date</Text>
                <Text style={styles.dateValue}>
                  {formattedDate}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.8}>
              <Text style={styles.dateIcon}>🕐</Text>

              <View>
                <Text style={styles.dateLabel}>Time</Text>
                <Text style={styles.dateValue}>
                  {formattedTime}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={deadline}
              mode="date"
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);

                if (selectedDate) {
                  setDeadline(selectedDate);
                }
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={deadline}
              mode="time"
              onChange={(_, selectedTime) => {
                setShowTimePicker(false);

                if (selectedTime) {
                  setDeadline(selectedTime);
                }
              }}
            />
          )}

          {/* Save */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              loading && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveText}>
                Save Changes
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  keyboard: {
    flex: 1,
  },

  content: {
    padding: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#18191D',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: '#92949C',
    marginBottom: 28,
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B4D55',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E7EC',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: '#18191D',
    marginBottom: 18,
  },

  descriptionInput: {
    minHeight: 90,
  },

  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E7EC',
    borderRadius: 12,
    paddingVertical: 11,
  },

  priorityButtonActive: {
    borderColor: '#635BFF',
    backgroundColor: '#EEEDFF',
  },

  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  lowDot: {
    backgroundColor: '#4BAA72',
  },

  mediumDot: {
    backgroundColor: '#DCA32D',
  },

  highDot: {
    backgroundColor: '#E05252',
  },

  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777983',
  },

  priorityTextActive: {
    color: '#635BFF',
  },

  deadlineRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },

  dateButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E7EC',
    borderRadius: 13,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateIcon: {
    fontSize: 17,
    marginRight: 9,
  },

  dateLabel: {
    fontSize: 9,
    color: '#9A9BA3',
    marginBottom: 2,
  },

  dateValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#303137',
  },

  saveButton: {
    backgroundColor: '#635BFF',
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  cancelButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },

  cancelText: {
    color: '#777983',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default EditTaskScreen;