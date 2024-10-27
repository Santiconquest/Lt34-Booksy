const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			auth: false,
			userEmail: null,
			userId: null,
			books : [],
			readers:[],
			reviews: []

		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			logoutCritico: () => {
				localStorage.removeItem("token")
				setStore({ auth: false, userEmail: null });
			},
			signupCritico: (email,password,name,lastName,gender,aboutMe) => {
				
				const requestOptions = {
					method: 'POST',
					headers: {'Content-Type' : 'application/json'}, 
					body: JSON.stringify({
						"email": email,
						"password": password,
						"nombre": name,
						"apellido": lastName,
						"genero": gender,
						"acerca_de_mi": aboutMe
					})
				};
				
				fetch(`${process.env.BACKEND_URL}/api/critico`,requestOptions)
					.then(response => {
						console.log (response.status)
						if (response.status == 200){
							setStore({ auth: true, userEmail: email });
					
						}
						return response.json()
					})
					.then(data => {
						localStorage.setItem("token",data.access_token)
						console.log(data)
					});
				},

				loginCritico: (email, password) => {
					
					const resquestOptions = {
						method: 'POST',
						headers: {'content-Type' : 'application/json'},
						body: JSON.stringify({
							"email": email,
							"password" : password
						})
					};
					fetch(`${process.env.BACKEND_URL}/api/loginCritico`, resquestOptions)
						.then(response => {
							console.log (response)
							if (response.status == 200)
								{
								setStore({ 
									auth: true,
									userEmail: email, 
								});

							}
							return response.json()
						})
						.then(data => {
							localStorage.setItem("token",data.access_token)
							setStore({userId: data.id})
							console.log(data)
						});
				},
			addLector:(email,password,name,lastName,suscriptionDate)=>{
				console.log(email,password,name,lastName,suscriptionDate)
				const store = getStore()
				const actions = getActions()
				const requestOptions = {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(email,password,name,lastName,suscriptionDate),
				  };
				  
				  fetch(`${process.env.BACKEND_URL}/api/signupLector`, requestOptions)
					.then((response) => {
						console.log(response)
						if(response.ok){
							return response.json()
						}
					})
					.then((result) => {
						if(result){
							setStore(store.readers.concat(result))
							return true
						}
					})
					
			},
			deleteLector: (idLectorToEdit) => {
				//console.log("Remove lector from flux"+ idToDelete)
				const store = getStore();
				
				const requestOptions = {
					method: "DELETE",
					redirect: "follow"
				  };
				  
				  fetch(`${process.env.BACKEND_URL}api/lector/`+idLectorToEdit, requestOptions)
					.then((response) => response.text())
					.then((result) => {
						console.log(result)
						// fetch(`${process.env.BACKEND_URL}`)
						// .then((response)=>response.json())
						// .then((data)=>setStore({readers:data.contacts}))
					})
			},
			editLector:(readerToEdit, idLectorToEdit)=>{
				console.log("Edito lector id: "+idLectorToEdit)
				const store = getStore();
				const actions = getActions()

				const requestOptions = {
					method: "PUT",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(readerToEdit),
				  };
				  
				  fetch(`${process.env.BACKEND_URL}admin/lector/`+idLectorToEdit, requestOptions)
				  .then((response) => {
					console.log(response)
					if(response.ok){
						actions.loadSomeData()
						return response.json()
					}
				})
				.then((result) => {
					if(result){
						setStore(store.readers.concat(result))
						return true
					}
				})

			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			getBooks: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/book");
                    const data = await response.json();
                    setStore({ books: data });
                } catch (error) {
                    console.log("Error fetching books", error);
                }
            },

            addBook: async (newBook) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/book", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(newBook)
                    });
                    if (response.ok) {
                        const data = await response.json();
                        getActions().getBooks(); 
                        return data;
                    } else {
                        throw new Error("Error adding book");
                    }
                } catch (error) {
                    console.log("Error adding book", error);
                }
            },

            updateBook: async (bookId, updatedBook) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + `/api/book/${bookId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updatedBook)
                    });
                    if (response.ok) {
                        const data = await response.json();
                        getActions().getBooks(); 
                        return data;
                    } else {
                        throw new Error("Error updating book");
                    }
                } catch (error) {
                    console.log("Error updating book", error);
                }
            },

            deleteBook: async (bookId) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + `/api/book/${bookId}`, {
                        method: "DELETE"
                    });
                    if (response.ok) {
                        const data = await response.json();
                        getActions().getBooks();
                        return data;
                    } else {
                        throw new Error("Error deleting book");
                    }
                } catch (error) {
                    console.log("Error deleting book", error);
                }
			},
			
			loginLector: async (email, password) => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                };

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/loginLector`, requestOptions);
                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem("token", data.access_token); 
                        setStore({ auth: true }); 
                        console.log("Login successful", data);
                    } else {
                        console.error("Login failed", response.status);
                    }
                } catch (error) {
                    console.error("Error logging in", error);
                }
            },

            logoutLector: () => {
                localStorage.removeItem("token"); 
                setStore({ auth: false }); 
                console.log("Logged out");
            },	
			addReview: async (id_critico, id_book, comentario) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/reviews`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							id_critico,
							id_book,
							comentario,
						}),
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error al crear la reseña:", errorData);
						return null;
					}
			
					const data = await response.json();
					console.log("Reseña creada:", data);
					return data; 
				} catch (error) {
					console.error("Error en la solicitud:", error);
				}
			},
			getReviews: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/reviews`);
                    const data = await response.json();
                    setStore({ reviews: data });
                } catch (error) {
                    console.log("Error fetching reviews", error);
                }
            },
				
		}
	};
};

export default getState;
