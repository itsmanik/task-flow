import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {createTask} from '../services/taskService';

type RootStackParamList = {
  Home: undefined;
  CreateTask: undefined;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CreateTask'
>;

function CreateTaskScreen({navigation}: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [priority, setPriority] = useState<
    'low' | 'medium' | 'high'
  >('medium');

  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000),
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (
    _event: any,
    selectedDate?: Date,
  ) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const updatedDeadline = new Date(deadline);

      updatedDeadline.setFullYear(
        selectedDate.getFullYear(),
      );
      updatedDeadline.setMonth(selectedDate.getMonth());
      updatedDeadline.setDate(selectedDate.getDate());

      setDeadline(updatedDeadline);
    }
  };

  const handleTimeChange = (
    _event: any,
    selectedTime?: Date,
  ) => {
    setShowTimePicker(false);

    if (selectedTime) {
      const updatedDeadline = new Date(deadline);

      updatedDeadline.setHours(selectedTime.getHours());
      updatedDeadline.setMinutes(selectedTime.getMinutes());

      setDeadline(updatedDeadline);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert(
        'Missing title',
        'Please enter a task title.',
      );
      return;
    }

    try {
      setLoading(true);

      await createTask({
        title: title.trim(),
        description: description.trim(),
        dateTime: new Date().toISOString(),
        deadline: deadline.toISOString(),
        priority,
      });

      Alert.alert(
        'Task created 🎉',
        'Your task has been added.',
      );

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Unable to create task',
        error.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">

          <Text style={styles.title}>
            Create a task
          </Text>

          <Text style={styles.subtitle}>
            Add something you want to get done.
          </Text>

          <Text style={styles.label}>
            Task title
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Finish assignment"
            placeholderTextColor="#A0A3AB"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>
            Description
          </Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add some details..."
            placeholderTextColor="#A0A3AB"
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>
            Priority
          </Text>

          <View style={styles.priorityRow}>
            {(['low', 'medium', 'high'] as const).map(
              level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priorityButton,
                    priority === level &&
                      styles.prioritySelected,
                  ]}
                  onPress={() => setPriority(level)}>

                  <Text
                    style={[
                      styles.priorityText,
                      priority === level &&
                        styles.prioritySelectedText,
                    ]}>
                    {level.charAt(0).toUpperCase() +
                      level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>

          <Text style={styles.label}>
            Deadline
          </Text>

          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}>

              <Text style={styles.dateIcon}>
                📅
              </Text>

              <View>
                <Text style={styles.dateLabel}>
                  Date
                </Text>

                <Text style={styles.dateValue}>
                  {deadline.toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowTimePicker(true)}>

              <Text style={styles.dateIcon}>
                ⏰
              </Text>

              <View>
                <Text style={styles.dateLabel}>
                  Time
                </Text>

                <Text style={styles.dateValue}>
                  {deadline.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={deadline}
              mode="date"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={deadline}
              mode="time"
              onChange={handleTimeChange}
            />
          )}

          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>
              Task deadline
            </Text>

            <Text style={styles.previewText}>
              {deadline.toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleCreate}
            disabled={loading}>

            <Text style={styles.buttonText}>
              {loading
                ? 'Creating...'
                : 'Create Task'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
    padding: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#17181C',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#737780',
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#34363D',
    marginBottom: 9,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#E1E3EA',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#17181C',
    marginBottom: 20,
  },

  textArea: {
    height: 120,
    paddingTop: 16,
  },

  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },

  priorityButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E3EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  prioritySelected: {
    backgroundColor: '#635BFF',
    borderColor: '#635BFF',
  },

  priorityText: {
    color: '#737780',
    fontWeight: '700',
  },

  prioritySelectedText: {
    color: '#FFFFFF',
  },

  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  dateButton: {
    flex: 1,
    minHeight: 68,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E1E3EA',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  dateLabel: {
    fontSize: 11,
    color: '#858891',
    marginBottom: 3,
  },

  dateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#17181C',
  },

  previewCard: {
    backgroundColor: '#EEEDFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
  },

  previewTitle: {
    color: '#3430A3',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 5,
  },

  previewText: {
    color: '#5956A5',
    fontSize: 14,
  },

  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#635BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default CreateTaskScreen;