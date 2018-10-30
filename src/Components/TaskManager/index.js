import React, { Component } from 'react';
import { Box, Button, Layer, TextArea, Select, Paragraph } from 'grommet';
import { Add, FormSubtract, FormClose, FormAdd, FormEdit  } from 'grommet-icons';

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
      newTaskModal: false,
      editTaskModal: false,
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
/* Handlers for opening and closing New and Edit task modals  */
  onNewTaskLayerOpen(status) {
		this.setState({ newTaskModal: true, dropValue: `${status}`});
  };
  onEditTaskLayerOpen(status, description, index) {
		this.setState({ editTaskModal: true, dropValue: `${status}`, taskDescription: `${description}`, status: `${status}`, selectedIndex: index});
  };
	onClose() {
		this.setState({ editTaskModal: false, newTaskModal: false, dropValue: '', taskDescription: ''});
  };
/* Handlers for submitting New and Edit task forms  */
  onEditTaskSubmit() {
    const { taskDescription, dropValue, status, selectedIndex} = this.state;
    if(taskDescription.trim().length > 0) {
      if(dropValue === status) {
        const { array, name } = this.findTaskArrayHandler(status);
        array[selectedIndex].text = taskDescription;
        this.setState({ [`${name}`]: array, editTaskModal: false, taskDescription: '' });
      }else{
        const task = this.findTaskArrayHandler(status);
        const newTask = this.findTaskArrayHandler(dropValue);
        task.array.splice(selectedIndex, 1);
        newTask.array = [...newTask.array, { text: taskDescription, selected: false, status: status }];
        this.setState({ [`${task.name}`]: task.array, [`${newTask.name}`]: newTask.array, editTaskModal: false, taskDescription: '' });
      }
    }
  }
  onNewTaskSubmit() {
    const { taskDescription, dropValue } = this.state;
    if(taskDescription.trim().length > 0) {
      const { array, name } = this.findTaskArrayHandler(dropValue);
      this.setState({
        [`${name}`]: [...array, { text: taskDescription, selected: false, status: dropValue }],
        taskDescription: '',
        dropValue: '',
        newTaskModal: false
      });
    } 
  };
/* Handler for deleteing tasks based on an array of indexes  */
  onDelete(status) {
    const { array, name, indexArray, indexArrayName } = this.findTaskArrayHandler(status);
    if(array.length > 0) {
      indexArray.sort((a, b) => b - a);
      indexArray.map((index) => array.splice(index, 1));
      this.setState({ [`${name}`]: array,  [`${indexArrayName}`]: [] });
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
      this.setState({ [`${indexArrayName}`]: [...indexArray, index], [`${name}`]: array });
    }else{
      array[index].selected = false;
      splice = indexArray.indexOf(index);
      indexArray.splice(splice, 1);
      this.setState({ [`${indexArrayName}`]: indexArray, [`${name}`]: array });
    }
  };
  render() {
    const { newTaskModal, editTaskModal, dropValue, unassignedTasks, inprogressTasks, completedTasks, taskDescription }  = this.state;
  /* Layer Logic and declaration  */
    let newTaskLayer;
    let editTaskLayer;
    if (newTaskModal) {
      newTaskLayer = <NewTaskLayer value={dropValue} description={taskDescription} onDropChange={ this.onDropChange } onSubmit={this.onNewTaskSubmit} onChange={ this.onTextAreaChange } onClose={ this.onClose } />
    }
    if(editTaskModal) {
      editTaskLayer = <EditTaskLayer value={dropValue} description={taskDescription} onDropChange={ this.onDropChange } onEdit={this.onEditTaskSubmit} onChange={ this.onTextAreaChange } onClose={ this.onClose } />
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
            <Button icon={<Add />} onClick={this.onNewTaskLayerOpen.bind(this, 'Unassigned')}></Button>
            <Button icon={<FormSubtract />} onClick={ this.onDelete.bind(this, 'Unassigned')}></Button>
          </Box>
          {unassignedTasks.map((task, index) => 
            <Box
              key={index}
              selected={task.selected}
              border={{ "color": `${task.selected ? 'neutral-4' : 'background-1' }`, "size": "medium" }}
              margin="small"
              round="small"
              pad="xsmall"
              direction="row"
              align="center"
            >
            <Box overflow="hidden" fill={true} onClick={this.onTaskSelect.bind(this, index, 'Unassigned')}>
              <Paragraph textAlign="center"> {task.text} </Paragraph>
            </Box>
              <Button onClick={this.onEditTaskLayerOpen.bind(this, 'Unassigned', task.text, index)} icon={<FormEdit />}></Button>
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
            <Button icon={ <Add /> } onClick={this.onNewTaskLayerOpen.bind(this, 'In Progress')}>
            </Button>
            <Button icon={<FormSubtract />} onClick={this.onDelete.bind(this, 'In Progress')}></Button>
          </Box>
          {inprogressTasks.map((task, index) =>
            <Box
              key={index}
              selected={task.selected}
              border={{ "color": `${task.selected ? 'neutral-4' : 'background-1' }`, "size": "medium" }}
              margin="small"
              round="small"
              pad="xsmall"
              direction="row"
              align="center"
            >
            <Box fill={true} overflow="hidden" onClick={this.onTaskSelect.bind(this, index, 'In Progress')}>
              <Paragraph textAlign="center">{task.text}</Paragraph>
            </Box>
              <Button onClick={this.onEditTaskLayerOpen.bind(this, 'In Progress', task.text, index)} icon={<FormEdit />}></Button>
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
            <Button icon={<Add />} onClick={ this.onNewTaskLayerOpen.bind(this, 'Completed')}></Button>
            <Button icon={<FormSubtract />} onClick={this.onDelete.bind(this, 'Completed')}></Button>
          </Box>
          {completedTasks.map((task, index) => 
            <Box
              key={index}
              selected={task.selected}
              border={{ "color": `${task.selected ? 'neutral-4' : 'background-1' }`, "size": "medium" }}
              margin="small"
              round="small"
              pad="xsmall"
              direction="row"
              align="center"
            >
            <Box fill={true} overflow="hidden" onClick={this.onTaskSelect.bind(this, index, 'Completed')}>
              <Paragraph textAlign="center">{task.text}</Paragraph>
            </Box>
              <Button onClick={this.onEditTaskLayerOpen.bind(this, 'Completed', task.text, index)} icon={<FormEdit />}></Button>
            </Box>
          )}
        </Box>
        <Box>
      {/* Layers */}
        {newTaskLayer}
        {editTaskLayer}
        </Box>
      </Box>
    )
  }
}

export default TaskManager;

/* New and Edit Task form layers  */
const NewTaskLayer = ({value, description, onDropChange, onClose, onChange, onSubmit }) => (
	<Layer
		position="center"
		onClickOutside={onClose}
		onEsc={onClose}
    margin="large"
    modal={true}
	>
		<Box margin="medium" direction="column">
			<TextArea
        placeholder="Enter the description of your task here"
        onChange={onChange}
        style={{ "resize": "none" }}
        value= {description}
			>
			</TextArea>
      <Box direction="row" justify="center">
        <Select
          placeholder="Status"
          margin="small"
          size="xsmall"
          options={['Unassigned', 'In Progress', 'Completed']}
          value={value}
          onChange={onDropChange}
        >
        </Select>
        <Button icon={<FormAdd />} onClick={onSubmit}></Button>
        <Button icon={<FormClose />}onClick={ onClose }></Button>
      </Box>
		</Box>
	</Layer>
);

const EditTaskLayer = ({value, description, onDropChange, onClose, onChange, onEdit }) => (
	<Layer
		position="center"
		onClickOutside={onClose}
		onEsc={onClose}
    margin="large"
    modal={true}
	>
		<Box margin="medium" direction="column">
			<TextArea
        placeholder="Enter the description of your task here"
        onChange={onChange}
        style={{ "resize": "none" }}
        value= {description}
			>
			</TextArea>
      <Box direction="row" justify="center">
        <Select
          placeholder="Status"
          margin="small"
          size="xsmall"
          options={['Unassigned', 'In Progress', 'Completed']}
          value={value}
          onChange={onDropChange}
        >
        </Select>
        <Button icon={<FormAdd />} onClick={onEdit}></Button>
        <Button icon={<FormClose />} onClick={onClose}>
        </Button>
      </Box>
		</Box>
	</Layer>
);