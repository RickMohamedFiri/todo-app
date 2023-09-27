import { useState, useEffect } from "react";
import styles from '../styles/Home.module.css';
import { BsTrashFill } from 'react-icons/bs';

const Cart = () => {
    const [todoList, setTodoList] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        fetch('http://localhost:9500/todos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(todos => {
                setTodoList(todos);
            })
            .catch(error => {
                console.error('Error fetching todos:', error);
            });
    }

    const handleInputChange = (e) => {
        setNewTodo(e.target.value);
    };

    const addItem = () => {
        const newTodoItem = {
            title: newTodo,
            completed: false,
        };
        fetch('http://localhost:9500/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodoItem),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok!');
                }
                return response.json();
            })
            .then(todoItem => {
                setTodoList(prevTodoList => [...prevTodoList, todoItem]);
                setNewTodo('');
            })
            .catch(error => {
                console.error('Error adding todo:', error);
            });
    }

    const removeItem = (id) => {
        fetch(`http://localhost:9500/todos/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setTodoList(prevTodoList => prevTodoList.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error('Error deleting todo:', error);
            });
    }

    const toggleComplete = (id) => {
        setTodoList(prevTodoList =>
            prevTodoList.map(item =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    }

    return (
        <>
            <div className={styles.main}>
                <div className={styles.cart}>
                    <div className={styles.title}>
                        <h2>Todo App</h2>
                        <div className={styles.form} >
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Enter activity"
                                value={newTodo}
                                onChange={handleInputChange}
                            />
                            <button className={styles.submit} onClick={addItem}>
                                Add
                            </button>
                        </div>
                    </div>
                    <div className={styles.list}>
                        { todoList.map(cartItem => (
                            <div key={cartItem.id} className={styles.li}>
                                <BsTrashFill
                                    className={styles.delete}
                                    onClick={() => removeItem(cartItem.id)}
                                />
                                <input
                                    type="checkbox"
                                    checked={cartItem.completed}
                                    onChange={() => toggleComplete(cartItem.id)}
                                />
                                <p className={cartItem.completed ? styles.completed : ''}>
                                    {cartItem.title}
                                </p>
                            </div>
                        )) }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;





