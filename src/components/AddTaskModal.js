import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../styles/theme';

const AddTaskModal = ({ visible, onClose, onSave, editingTask, onDelete, initialTitle }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [hasTime, setHasTime] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      if (editingTask.dueDate) {
        setDate(new Date(editingTask.dueDate));
        setHasTime(true);
      } else {
        setDate(new Date());
        setHasTime(false);
      }
    } else {
      setTitle(initialTitle || '');
      setDescription('');
      setDate(new Date());
      setHasTime(false);
    }
    setError('');
  }, [editingTask, visible, initialTitle]);

  const handleSave = () => {
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate: hasTime ? date.getTime() : null,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </Text>

          <Text style={styles.label}>Task Title</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (error) setError('');
            }}
            placeholder="What needs to be done?"
            placeholderTextColor={theme.colors.textMuted}
            autoFocus
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add details..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Due Time</Text>
          {Platform.OS === 'ios' ? (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                    setHasTime(true);
                  }
                }}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.input} 
                onPress={() => setShowPicker(true)}
              >
                <Text style={{ color: hasTime ? theme.colors.text : theme.colors.textMuted }}>
                  {hasTime ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Select a time"}
                </Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) {
                      setDate(selectedDate);
                      setHasTime(true);
                    }
                  }}
                />
              )}
            </>
          )}

          <View style={styles.buttonContainer}>
            {editingTask && onDelete && (
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => {
                  onDelete(editingTask.id);
                  onClose();
                }}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
            <View style={{flex: 1}} />
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {editingTask ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  multilineInput: {
    minHeight: 80,
  },
  pickerContainer: {
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
    marginTop: -theme.spacing.sm,
    ...theme.typography.caption,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    alignItems: 'center',
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  deleteButtonText: {
    ...theme.typography.body,
    color: theme.colors.error,
  },
  cancelButton: {
    padding: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  cancelButtonText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
  },
  saveButtonText: {
    ...theme.typography.body,
    color: theme.colors.surface,
  },
});

export default AddTaskModal;
