import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  Modal,
  Animated,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const addTask = () => {
    if (task.trim() !== '') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newTask = {
        id: Math.random().toString(),
        value: task,
        completed: false,
        createdAt: new Date(),
        priority: Math.floor(Math.random() * 3) // Random priority 0-2
      };
      setTaskItems([...taskItems, newTask]);
      setTask('');
    }
  };

  const deleteTask = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTaskItems(taskItems.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTaskItems(taskItems.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 0: return '#FF5722'; // High Priority
      case 1: return '#FF9800'; // Medium Priority
      case 2: return '#2196F3'; // Low Priority
      default: return '#2196F3';
    }
  };

  const openTaskDetails = (task) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTask(task);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.taskItem, 
        { 
          borderLeftColor: getPriorityColor(item.priority),
          backgroundColor: item.completed ? '#E8EAF6' : 'white'
        }
      ]}
      onPress={() => toggleTaskCompletion(item.id)}
      onLongPress={() => openTaskDetails(item)}
    >
      <View style={styles.taskContent}>
        <View style={[
          styles.taskStatusIndicator,
          { 
            backgroundColor: item.completed 
              ? '#4CAF50' 
              : getPriorityColor(item.priority)
          }
        ]} />
        <Text 
          style={[
            styles.taskText, 
            item.completed && styles.completedTaskText
          ]}
        >
          {item.value}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={() => deleteTask(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons 
          name="trash" 
          size={20} 
          color="#FF5722" 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6A1B9A', '#4A148C']}
        style={styles.background}
      >
        <StatusBar style="light" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Task Manager</Text>
          <Text style={styles.headerSubtitle}>
            {taskItems.length} {taskItems.length === 1 ? 'Task' : 'Tasks'}
          </Text>
        </View>

        {/* Task List */}
        <FlatList
          data={taskItems}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons 
                name="list-outline" 
                size={50} 
                color="rgba(255,255,255,0.5)" 
              />
              <Text style={styles.emptyStateText}>
                Your task list is empty
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Add a new task to get started
              </Text>
            </View>
          }
          contentContainerStyle={styles.taskList}
        />

        {/* Input Area */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="What's your next task?"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addTask}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </KeyboardAvoidingView>

        {/* Task Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Animated.View 
            style={[
              styles.modalContainer, 
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Task Details</Text>
              {selectedTask && (
                <>
                  <Text 
                    style={[
                      styles.modalTaskText, 
                      { color: getPriorityColor(selectedTask.priority) }
                    ]}
                  >
                    {selectedTask.value}
                  </Text>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Created:</Text>
                    <Text style={styles.modalDetailValue}>
                      {selectedTask.createdAt.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Status:</Text>
                    <Text style={styles.modalDetailValue}>
                      {selectedTask.completed ? 'Completed' : 'Pending'}
                    </Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Priority:</Text>
                    <Text 
                      style={[
                        styles.modalDetailValue,
                        { color: getPriorityColor(selectedTask.priority) }
                      ]}
                    >
                      {selectedTask.priority === 0 
                        ? 'High' 
                        : selectedTask.priority === 1 
                        ? 'Medium' 
                        : 'Low'}
                    </Text>
                  </View>
                </>
              )}
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  taskList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskStatusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    padding: 5,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    padding: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 30,
    marginRight: 10,
    fontSize: 16,
    color: 'white',
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#6A1B9A',
  },
  modalTaskText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalDetailLabel: {
    color: '#666',
    fontWeight: '500',
  },
  modalDetailValue: {
    color: '#333',
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 15,
    backgroundColor: '#6A1B9A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});