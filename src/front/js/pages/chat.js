import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import "../../styles/chat.css";
import { NavbarContenido } from "../component/navbarContenido.js";
import { Footer } from "../component/footer.js";

export const Chat = () => {
    const { store, actions } = useContext(Context);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [activeChatId, setActiveChatId] = useState(null);
    const [activeChat, setActiveChat] = useState(null); 
    const location = useLocation(); 
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Almacena el término de búsqueda
    const [filteredUsers, setFilteredUsers] = useState([]); // Usuarios que coinciden con la búsqueda


    const userId = store.lectorId;

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredUsers([]);
            return;
        }
    
        const existingChatUserIds = new Set(chats.flatMap(chat => [chat.id_lector_1, chat.id_lector_2]));
    
        const filtered = users.filter(user =>
            !existingChatUserIds.has(user.id) && // Excluir usuarios ya en chats
            user.id !== userId &&               // Excluir el usuario logueado
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) // Coincidencia con el término de búsqueda
        );
    
        setFilteredUsers(filtered);
    }, [searchTerm, users, chats, userId]);
    
    

    const handleCreateChat = async (selectedUserId) => {
        try {
            const newChat = {
                id_lector_1: userId,
                id_lector_2: selectedUserId,
            };
    
            const response = await fetch(`${process.env.BACKEND_URL}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newChat),
            });
    
            if (response.ok) {
                await fetchChats(); // Refrescar la lista de chats
                setSearchTerm("");  // Limpiar el término de búsqueda
                setFilteredUsers([]); // Limpiar los usuarios filtrados
            } else {
                console.error("Error al crear el chat:", response.status);
            }
        } catch (error) {
            console.error("Error creando un nuevo chat:", error);
        }
    };
    
    

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/lector`);
            const data = await response.json();
    
            const extractedUsers = data.map(user => ({
                id: user.id,
                name: user.name
            }));
    
            setUsers(extractedUsers);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };
    
    
      
      useEffect(() => {
        fetchUsers();
      }, []);
    

    useEffect(() => {
        if (userId) {
            console.log("User ID:", userId);
        }
    }, [userId]);

    const fetchChats = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/chat`);
            const data = await response.json();
            if (Array.isArray(data)) {
                const filteredChats = data.filter(chat => 
                    chat.id_lector_1 == userId || chat.id_lector_2 == userId
                );
                setChats(filteredChats);
            } else {
                console.error("Unexpected response format:", data);
                setChats([]);
            }
        } catch (error) {
            console.error("There was an error fetching the chats!", error);
        }
    };
    

    useEffect(() => {
        if (userId) {
            fetchChats();
        }
    }, [userId]);

    useEffect(() => {
        if (activeChatId) {
            fetch(`${process.env.BACKEND_URL}/api/chat/${activeChatId}`)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        setActiveChat(data);
                        console.log(data);
                    } else {
                        console.error("Unexpected response format:", data);
                        setActiveChat(null);
                    }
                })
                .catch(error => {
                    console.error("There was an error fetching the active chat!", error);
                });
        }
    }, [activeChatId]);

    useEffect(() => {
        if (activeChatId) {
            fetch(`${process.env.BACKEND_URL}/api/message?chat_id=${activeChatId}`)
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setMessages(data);
                    } else {
                        console.error("Unexpected response format:", data);
                        setMessages([]);
                    }
                })
                .catch(error => {
                    console.error("There was an error fetching the messages!", error);
                });
        } else {
            setMessages([]);
        }
    }, [activeChatId]);

    const handleSendMessage = () => {
        if (messageInput.trim() && userId && activeChatId && activeChat) {
            const otherLectorId = activeChat.id_lector_1 === userId ? activeChat.id_lector_2 : activeChat.id_lector_1;
    
            const newMessage = {
                id_lector_1: userId,
                id_lector_2: otherLectorId,
                chat_id: activeChatId,
                origin: userId,
                message: messageInput,
                date: new Date().toLocaleDateString(),
                hour: new Date().toLocaleTimeString(),
            };
    
            fetch(`${process.env.BACKEND_URL}/api/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMessage),
            })
                .then(response => response.json())
                .then(data => {
                    if (data && data.message) {
                       
                        setMessages(prevMessages => [...prevMessages, data.message]);
                        setMessageInput("");
    
                        setChats(prevChats => 
                            prevChats.map(chat => 
                                chat.id === activeChatId ? { ...chat, lastMessage: data.message } : chat
                            )
                        );
                    } else {
                        console.error("Estructura de respuesta inesperada:", data);
                    }
                })
                .catch(error => {
                    console.error("Hubo un error al enviar el mensaje!", error);
                });
        }
    };
    
    const handleSelectChat = (chatId) => {
        setActiveChatId(chatId);
        setMessages([]); 
    
        fetch(`${process.env.BACKEND_URL}/api/message?chat_id=${chatId}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setMessages(data); 
                } else {
                    console.error("Unexpected response format:", data);
                    setMessages([]);
                }
            })
            .catch(error => {
                console.error("Hubo un error al obtener los mensajes del chat seleccionado!", error);
            });
    };
    
  
    if (!userId) {
        return <div>Loading chat...</div>;
    }

    return (
        <>
        <NavbarContenido/>
        <div className="container page-container">
        <div className="row" style={{ width: '100%' }}>
            <div className="col-12 col-md-3" >

            <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
              <div className="collapse d-md-block" id="sidenavCollapse">
              <div className="card-body text-start" style={{ paddingLeft: '20px', paddingTop: "11px" }}>

                <h6 className="fw-bold text-uppercase mb-3 mt-2">
                     Mi Biblioteca
                </h6>

                <div className="row card-list list text-gray-700 mb-0">
                    <nav className="nav flex-column">            
                        <Link to="/readersListOfBooks" className="nav-item nav-link">
                            Lista de Libros
                        </Link>
                        <Link to="/favoritosLector" className="nav-item nav-link">
                            Favoritos
                        </Link>
                        <Link to="/wishlistLector" className="nav-item nav-link">
                            Wishlist
                        </Link>
                    </nav>
                </div>
                </div>
              </div>

            </div>
            <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
              <div className="collapse d-md-block" id="sidenavCollapse">
              <div className="card-body text-start" style={{ paddingLeft: '20px', paddingTop: "8px" }}>

                <h6 className="fw-bold text-uppercase mb-3 mt-2">
                    Herramientas Booksy
                </h6>

                <div className="row card-list list text-gray-700 mb-0">
                    <nav className="nav flex-column">
                        <Link to="/chat" className={`nav-item nav-link ${location.pathname === "/chat" ? "active" : ""}`} >
                            ChatScribe
                        </Link>
                        <Link to="/visionAPI" className="nav-item nav-link">
                            ScanBook
                        </Link>
                        <Link 
                            to="/bookRecommendations" 
                            className={`nav-item nav-link ${location.pathname === "/bookRecommendations" ? "active" : ""}`} 
                        >
                            Sugerencias AI
                        </Link>
                    </nav>    
                </div>
                </div>
              </div>

            </div>
          </div>
          <div className="col-12 col-md-9">
            <div className="card card-bleed shadow-light-lg mb-6 me-0 ms-3">
              <div className="card-body">

                
              <div className="row">
              <div className="card-body text-start" style={{ paddingLeft: '18px', paddingTop: "1px" }}>
                <h5 className="recomm-title mb-4">ChatScribe</h5>
                </div>
              <div className="text-center" style={{ maxWidth: '800px', margin: '20px auto' }}>
              <div className="container">
            <div className="row clearfix">
                <div className="col-lg-12">
                   
                        <div id="plist" className="people-list">
                        <div className="input-group mt-4">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="fa fa-search"></i></span>
                            </div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar usuario..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <ul className="list-unstyled chat-list mt-2 mb-0">
                            {filteredUsers.map(user => (
                                <li className="clearfix" key={user.id}>
                                    <div className="about">
                                        <div className="name">{user.name}</div>
                                        <div className="status">
                                            <button 
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleCreateChat(user.id)}
                                            >
                                                Iniciar Chat
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <ul className="list-unstyled chat-list mt-2 mb-0">
                            {chats.map(chat => chat?.id && (
                                <li className="clearfix" key={chat.id} onClick={() => handleSelectChat(chat.id)}>
                                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                                    <div className="about">
                                        <div className="name">
                                            {
                                                // Encuentra el usuario que no es el logueado
                                                users.find(user => 
                                                    user.id === (chat.id_lector_1 === userId ? chat.id_lector_2 : chat.id_lector_1)
                                                )?.name || "Usuario desconocido"
                                            }
                                        </div>
                                        <div className="status">
                                            <i className="fa fa-circle online"></i> online
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>



                        </div>

                        <div className="chat">
                            <div className="chat-header clearfix">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <a onClick={(e) => e.preventDefault()} data-toggle="modal" data-target="#view_info">
                                            <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar" />
                                        </a>
                                        <div className="chat-about">
                                            <h6 className="m-b-0">
                                                 Chat...
                                                {activeChat 
                                                    ? users.find(user => user.id === (activeChat.id_lector_1 !== userId ? activeChat.id_lector_1 : activeChat.id_lector_2))?.name || "Usuario desconocido"
                                                    : '...'}
                                            </h6>
                                            <small>Last seen: a few minutes ago</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                       


                            <div className="chat-history">
                                <ul className="m-b-0">
                                    {Array.isArray(messages) && messages.map((message, index) => (
                                        <React.Fragment key={index}>
                                            <li className="clearfix">
                                                <div className={`message-data ${message.origin === userId ? 'text-right' : ''}`}>
                                                    {message.origin !== userId && (
                                                        <img />
                                                    )}
                                                    {message.origin !== userId && (
                                                        <span className="message-data-time">{message.hour}, {message.date}</span>
                                                    )}
                                                </div>
                                            </li>

                                            <li className="clearfix text-start">
                                                <div className={`message ${message.origin === userId ? 'my-message float-right' : 'other-message float-left'} `}>
                                                    {message.origin === userId && (
                                                        <span className="message-data-time-right mx-5">{message.hour}, {message.date}</span>
                                                    )}
                                                    {message.message}
                                                </div>
                                            </li>
                                        </React.Fragment>
                                    ))}
                                </ul>
                            </div>



                            <div className="chat-message clearfix">
                                <div className="input-group mb-0">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-send"></i></span>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter text here..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
                                    </div>
                                </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
            </div>            
            </div>

              </div>
            </div>


          </div>
        </div>
        </div>
        <Footer/>
        </>
    );
};


