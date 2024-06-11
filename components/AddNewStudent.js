import React, { useState } from 'react';
import { Container, Header, Segment, Icon, Button, Form, Message, Grid, Image } from 'semantic-ui-react';

const AddNewStudent = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        address: '',
        class: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e, { name, value }) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const token = localStorage.getItem('token');

        const form = new FormData();
        Object.keys(formData).forEach(key => {
            form.append(key, formData[key]);
        });
        if (imageFile) {
            form.append('image', imageFile);
        }

        try {
            const response = await fetch('http://localhost:3000/user/v1/addStudent', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: form,
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to add student');
            }

            setSuccessMessage('Student added successfully');
            setFormData({
                name: '',
                username: '',
                password: '',
                address: '',
                class: '',
            });
            setImageFile(null);
            setPreviewImage(null);
        } catch (error) {
            console.error('Error adding student:', error);
            setError(error.message || 'Failed to add student. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid textAlign='center' style={{ backgroundColor: '#E6EFF4', color: '#1c1c1c', width: '100vw', maxWidth: '100%', padding: '2em' }}>
            <Segment style={{ backgroundColor: '#E7EEF4', color: '#5B9DBF', padding: '3em', borderRadius: '15px' }}>
                
                <Form onSubmit={handleSubmit} error={error !== null} success={successMessage !== null} loading={loading}>
                    <Grid columns={2} stackable>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Input
                                    label="Student Name"
                                    placeholder='Student Name'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Input
                                    label="Username"
                                    placeholder='Username'
                                    name='username'
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Input
                                    type='password'
                                    label='Password'
                                    placeholder='Password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Input
                                    label='Class'
                                    placeholder='Class'
                                    name='class'
                                    value={formData.class}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Input
                                    type='file'
                                    label='Image'
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                                {previewImage && (
                                    <Segment textAlign='center' style={{ backgroundColor: '#1c1c1c', color: '#fff' }}>
                                        <Image src={previewImage} size='small' centered />
                                    </Segment>
                                )}
                                <Form.TextArea
                                    label='Address'
                                    placeholder='Address'
                                    name='address'
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Message
                        success
                        header='Success'
                        content={successMessage}
                    />
                    <Message
                        error
                        header='Error'
                        content={error}
                    />
                    <Button primary type='submit' style={{ backgroundColor: '#E50914', color: '#fff', marginTop: '1em', borderRadius: '15px' }}>Add Student</Button>
                </Form>
            </Segment>
        </Container>
    );
};

export default AddNewStudent;
