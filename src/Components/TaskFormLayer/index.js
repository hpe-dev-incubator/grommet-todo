import React from 'react';
import { Layer, Box, TextArea, Select, Button } from 'grommet';
import { FormAdd, FormClose } from 'grommet-icons'; 

const TaskFormLayer = ({value, description, onDropChange, onClose, onChange, onSubmit, onEdit, edit }) => (
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
        <Button icon={<FormAdd />} onClick={edit ? onEdit : onSubmit}></Button>
        <Button icon={<FormClose />}onClick={ onClose }></Button>
      </Box>
		</Box>
	</Layer>
);

export default TaskFormLayer;