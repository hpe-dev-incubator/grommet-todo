import React, { Component } from 'react';
import { Box, Button, Paragraph } from 'grommet';
import { Add, FormSubtract, FormEdit  } from 'grommet-icons';
import TaskFormLayer from '../TaskFormLayer';

class TaskManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unassignedTasks: [],
      inprogressTasks: [],
      completedTasks: [],
      selectedUnassigned: [],
      selectedInprogress: [],
      selectedCompleted: [],
      taskDescription: '',
      taskFormModal: false,
      edit: false,
      dropValue: '',
      status: '',
      selectedIndex: ''
    }
    this.onClose = this.onClose.bind(this);
    this.onNewTaskSubmit = this.onNewTaskSubmit.bind(this);
    this.onTextAreaChange = this.onTextAreaChange.bind(this);
    this.onDropChange = this.onDropChange.bind(this);
    this.onEditTaskSubmit = this.onEditTaskSubmit.bind(this);
    this.findTaskArrayHandler = this.findTaskArrayHandler.bind(this); 
  }
/* Handler returns arrays and array names based on task status */
  findTaskArrayHandler(status) {
    const { unassignedTasks, inprogressTasks, completedTasks, selectedUnassigned, selectedInprogress, selectedCompleted } = this.state;
    switch(status){
      case 'Unassigned':
        return { array: unassignedTasks, name: 'unassignedTasks', indexArray: selectedUnassigned, indexArrayName: 'selectedUnassigned' }
      case 'In Progress':
        return { array: inprogressTasks, name: 'inprogressTasks', indexArray: selectedInprogress, indexArrayName: 'selectedInprogress' }
      case 'Completed': 
        return { array: completedTasks, name: 'completedTasks', indexArray: selectedCompleted, indexArrayName: 'selectedCompleted' }
      default:
        break;
    }
  }
/* Handlers for opening and closing task form modal  */
  onLayerOpen(status, description, index) {
    const clicked = description !== ''
		this.setState({ taskFormModal: true, edit: clicked, dropValue: `${status}`, taskDescription: `${description}`, status: `${status}`, selectedIndex: index});
  };
	onClose() {
		this.setState({ edit: false, taskFormModal: false, dropValue: '', taskDescription: ''});
  };
/* Handlers for submitting New and Edit task forms  */
  onEditTaskSubmit() {
    const { taskDescription, dropValue, status, selectedIndex} = this.state;
    if(taskDescription.trim().length > 0) {
      if(dropValue === status) {
        const { array, name } = this.findTaskArrayHandler(status);
        array[selectedIndex].text = taskDescription;
        this.setState({ [name]: array, edit: false, taskFormModal: false, taskDescription: '' });
      }else{
        const task = this.findTaskArrayHandler(status);
        const newTask = this.findTaskArrayHandler(dropValue);
        task.array.splice(selectedIndex, 1);
        newTask.array = [...newTask.array, { text: taskDescription, selected: false, status: status }];
        this.setState({ [task.name]: task.array, [newTask.name]: newTask.array, edit: false, taskFormModal: false, taskDescription: '' });
      }
    }
  }
  onNewTaskSubmit() {
    const { taskDescription, dropValue } = this.state;
    if(taskDescription.trim().length > 0) {
      const { array, name } = this.findTaskArrayHandler(dropValue);
      this.setState({
        [name]: [...array, { text: taskDescription, selected: false, status: dropValue }],
        taskDescription: '',
        dropValue: '',
        taskFormModal: false
      });
    } 
  };
/* Handler for deleteing tasks based on an array of indexes  */
  onDelete(status, index) {
    const { array, name } = this.findTaskArrayHandler(status);
    array.splice(index, 1);
    this.setState({ [name]: array })
  }
  onMultiDelete(status) {
    const { array, name, indexArray, indexArrayName } = this.findTaskArrayHandler(status);
    if(array.length > 0) {
      indexArray.sort((a, b) => b - a);
      indexArray.map((index) => array.splice(index, 1));
      this.setState({ [name]: array,  [indexArrayName]: [] });
    }
  };
/* Handlers that listen for drop down menu changes and text area changes within the New and Edit Task forms  */
  onDropChange(event) {
    this.setState({
      dropValue: event.value,
    });
  };
  onTextAreaChange(event) {
    const description = event.target.value
    this.setState({ taskDescription: description });
  };
/* Handler that changes the task border and adds its index to an array  */
  onTaskSelect(index, status) {
    let splice;
    const { array, name, indexArray, indexArrayName } = this.findTaskArrayHandler(status);
    if(array[index].selected === false) {
      array[index].selected = true;
      this.setState({ [indexArrayName]: [...indexArray, index], [name]: array });
    }else{
      array[index].selected = false;
      splice = indexArray.indexOf(index);
      indexArray.splice(splice, 1);
      this.setState({ [indexArrayName]: indexArray, [name]: array });
    }
  };
  render() {
    const { taskFormModal, edit, dropValue, unassignedTasks, inprogressTasks, completedTasks, taskDescription }  = this.state;
  /* Layer Logic and declaration  */
    let taskFormLayer;
    if (taskFormModal) {
      taskFormLayer = <TaskFormLayer value={dropValue} description={taskDescription} onDropChange={ this.onDropChange } onSubmit={this.onNewTaskSubmit} onChange={this.onTextAreaChange} onClose={this.onClose} onEdit={this.onEditTaskSubmit} edit={edit} />
    }
    return(
      <Box
        direction="row-responsive"
        margin="small"
        gap="xsmall"
        align="start"
        justify="between"
      >
      {/* Unassigned Task Column */}
        <Box
          direction="column"
          basis="1/3"
          round="xsmall"
          background={{ "color": "accent-4", "opacity": "strong" }}
        >
          <Box direction="row" >
            <Button icon={<Add />} onClick={this.onLayerOpen.bind(this, 'Unassigned', '', '')}></Button>
            <Button icon={<FormSubtract />} onClick={this.onMultiDelete.bind(this, 'Unassigned')}></Button>
        {/* Unassigned Tasks and edit button  */}
          </Box>
          {unassignedTasks.map((task, index) => 
            <Box
              key={index}
              selected={task.selected}
              border={{ "color": `${task.selected ? 'neutral-4' : 'grommet-pink' }`, "size": "medium" }}
              margin="small"
              round="small"
              pad="xsmall"
              direction="row"
              align="center"
            >
            <Box overflow="hidden" fill={true} onClick={this.onTaskSelect.bind(this, index, 'Unassigned')}>
              <Paragraph textAlign="center"> {task.text} </Paragraph>
            </Box>
              <Button style={{ padding: 4 }} onClick={this.onLayerOpen.bind(this, 'Unassigned', task.text, index)} icon={<FormEdit />}></Button>
              <Button style={{ padding: 4 }} onClick={this.onDelete.bind(this, 'Unassigned', index)} icon={<FormSubtract />}></Button>
            </Box>
          )}
        </Box>
      {/* In Progress Task Column */}
        <Box
          direction="column"
          basis="1/3"
          round="xsmall"
          background={{"color": "accent-3", "opacity": "strong"}}
        >
          <Box direction="row">
            <Button icon={ <Add /> } onClick={this.onLayerOpen.bind(this, 'In Progress', '', '')}>
            </Button>
            <Button icon={<FormSubtract />} onClick={this.onMultiDelete.bind(this, 'In Progress')}></Button>
        {/* In Progress Tasks and edit button */}
          </Box>
          {inprogressTasks.map((task, index) =>
            <Box
              key={index}
              selected={task.selected}
              border={{ "color": `${task.selected ? 'neutral-4' : 'grommet-pink' }`, "size": "medium" }}
              margin="small"
              round="small"
              pad="xsmall"
              direction="row"
              align="center"
            >
            <Box fill={true} overflow="hidden" onClick={this.onTaskSelect.bind(this, index, 'In Progress')}>
              <Paragraph textAlign="center">{task.text}</Paragraph>
            </Box>
              <Button style={{ padding: 4 }} onClick={this.onLayerOpen.bind(this, 'In Progress', task.text, index)} icon={<FormEdit />}></Button>
              <Button style={{ padding: 4 }} onClick={this.onDelete.bind(this, 'In Progress', index)} icon={<FormSubtract />}></Button>
            </Box>
          )}
        </Box>
      {/* Completed Task Column */}
        <Box
          direction="column"
          basis="1/3"
          round="xsmall"
          background={{ "color": "accent-2", "opacity": "strong" }}
        >
          <Box direction="row">
            <Button icon={<Add />} onClick={ this.onLayerOpen.bind(this, 'Completed', '', '')}></Button>
            <Button icon={<FormSubtract />} onClick={this.onMultiDelete.bind(this, 'Completed')}></Button>
        {/* Completed Tasks and edit button  */}
          </Box>
          {completedTasks.map((task, index) => 
            <Box
              key={index}
              selected={task.selected}
              border={{ "color": `${task.selected ? 'neutral-4' : 'grommet-pink' }`, "size": "medium" }}
              margin="small"
              round="small"
              pad="xsmall"
              direction="row"
              align="center"
            >
            <Box fill={true} overflow="hidden" onClick={this.onTaskSelect.bind(this, index, 'Completed')}>
              <Paragraph textAlign="center">{task.text}</Paragraph>
            </Box>
              <Button style={{ padding: 4 }} onClick={this.onLayerOpen.bind(this, 'Completed', task.text, index)} icon={<FormEdit />}></Button>
              <Button style={{ padding: 4 }} onClick={this.onDelete.bind(this, 'Completed', index)} icon={<FormSubtract />}></Button>
            </Box>
          )}
        </Box>
        <Box>
      {/* Layers */}
        {taskFormLayer}
        </Box>
      </Box>
    )
  }
}

export default TaskManager;