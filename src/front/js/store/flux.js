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
			auth: !!localStorage.getItem("token"),
			userType: localStorage.getItem("userType") || "",
			userEmail: null,
			userId: null,
			lectorId: localStorage.getItem("lectorId") || null,
			books : [],
			recommendations: [],
			readers:[],
			reviews: JSON.parse(localStorage.getItem('reviews')) || [],
			lectorName: localStorage.getItem("lectorName") || "",
			categories:[],
			autores:[],
			administradores:[],
			autorDetail:{},
			critico: [],
			imageUrl: "", 
            loading: false, 
			lector: [{}],
			userEmailLector: null,
            loading: false,
			favorites: Array.isArray(JSON.parse(localStorage.getItem('favorites'))) ? JSON.parse(localStorage.getItem('favorites')) : [],
			wishlist: Array.isArray(JSON.parse(localStorage.getItem('wishlist'))) ? JSON.parse(localStorage.getItem('wishlist')) : []
		},
		actions: {
			// Dentro de tus actions en el contexto
			editCritico: (idCritico, email, password, nombre, apellido) => {
				const store = getStore();
				const actions = getActions();
	
				const requestOptions = {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						nombre: nombre,
						apellido: apellido,
						email: email,
						password: password
					}),
				};
	
				fetch(`${process.env.BACKEND_URL}/admin/critico/${idCritico}`, requestOptions)
					.then((response) => {
						console.log(response);
						if (response.ok) {
							actions.loadSomeData(); 
							return response.json();
						} else {
							throw new Error("Error al actualizar el crítico");
						}
					})
					.then((result) => {
						if (result) {
							
							setStore((prevStore) => ({
								...prevStore,
								critics: prevStore.critics.map(critic => 
									critic.id === idCritico ? { ...critic, ...result } : critic
								)
							}));
							return true;
						}
					})
					.catch((error) => {
						console.error("Error en la actualización del crítico:", error);
					});
			},
			editReview: async (updatedReview, reviewId) => {
				const store = getStore();

				const requestOptions = {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedReview),
				};

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/reviews/${reviewId}`, requestOptions);
					if (response.ok) {
						const result = await response.json();
					
						setStore({
							...store,
							reviews: store.reviews.map(review =>
								review.id === reviewId ? { ...review, comentario: result.comentario } : review
							)
						});
						return true;
					} else {
						console.error("Error al editar la reseña:", response.status);
						return false;
					}
				} catch (error) {
					console.error("Error al editar la reseña:", error);
					return false;
				}
			},

			
			deleteReview: async (idReview) => {
				const store = getStore();
			
				const requestOptions = {
					method: "DELETE",
					redirect: "follow"
				};
			
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/reviews/${idReview}`, requestOptions);
					
					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error al eliminar la reseña:", errorData);
						return false; 
					}
					
					console.log("Reseña eliminada con éxito:", idReview);
					return true; 
				} catch (error) {
					console.error("Error en la solicitud de eliminación:", error);
					return false; 
				}
			},
			
			getCritico: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/critico`);
					const data = await response.json();
					console.log("Critico data fetched:", data[0].nombre); 
					setStore({ critico: data[0] });
				} catch (error) {
					console.log("Error fetching critic:", error);
				}
			},
			
			
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			uploadImage: async (files) => {
				const store = getStore();
				const preset_name = "imagenes";                         
				const cloud_name = "dul7enfrl";  
				const data = new FormData();
				data.append("file", files[0]);
				data.append("upload_preset", preset_name);
			
				setStore({ loading: true });
			
				await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
					method: "POST",
					body: data
				})
				.then(response => response.json())
				.then(file => {
					const imageUrl = file.secure_url;
					setStore({ imageUrl, loading: false });
					localStorage.setItem("imageUrl", imageUrl); // Guarda la URL en localStorage
					return file;
				})
				.catch(error => {
					console.error("Error uploading image:", error);
					setStore({ loading: false });
				});
			
				return store.imageUrl;
			},
			
			logoutCritico: () => {
				localStorage.removeItem("token")
				localStorage.removeItem("userType")
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
				

				getRecommendations: async () => {
					const store = getStore();
					const lectorId = store.lectorId;
					setStore({ loading: true });
				
					try {
						const response = await fetch(`${process.env.BACKEND_URL}/api/lector/${lectorId}/recommendations`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'Authorization': `Bearer ${localStorage.getItem("token")}`
							}
						});
						
						if (!response.ok) {
							throw new Error('Error al obtener recomendaciones');
						}
						
						const data = await response.json();
						console.log("Data received from API:", data);
						setStore({ recommendations: [data.recommendation] }); // Cambia a un array
						console.log("Recommendations in store:", getStore().recommendations);
				
					} catch (error) {
						console.error('Error:', error);
					} finally {
						setStore({ loading: false });
					}
				},
				

				loginCritico: (email, password) => {
					const requestOptions = {
						method: 'POST',
						headers: { 'content-Type': 'application/json' },
						body: JSON.stringify({ "email": email, "password": password })
					};
					fetch(`${process.env.BACKEND_URL}/api/loginCritico`, requestOptions)
						.then(response => {
							if (response.status === 200) {
								localStorage.setItem("userType", "critic");
								setStore({
									auth: true,
									userEmail: email,
									userType: "critic",  // Asegúrate de que se actualiza el userType
								});
							}
							return response.json();
						})
						.then(data => {
							localStorage.setItem("token", data.access_token);
							setStore({ userId: data.id });
						});
				},
				
				
			addLector:(email,password,name,lastname)=>{
				console.log(email,password,name,lastname)
				const store = getStore()
				const actions = getActions()
				const requestOptions = {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({"name":name,"lastname":lastname,"email":email,"password":password}),
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
			deleteLector: (idLector) => {
				//console.log("Remove lector from flux"+ idToDelete)
				const store = getStore();
				
				const requestOptions = {
					method: "DELETE",
					redirect: "follow"
				  };
				  
				  fetch(`${process.env.BACKEND_URL}api/lector/`+idLector, requestOptions)
					.then((response) => response.text())
					.then((result) => {
						console.log(result)
						// fetch(`${process.env.BACKEND_URL}`)
						// .then((response)=>response.json())
						// .then((data)=>setStore({readers:data.contacts}))
					})
			},
			editLector:(idLector,email,password,name,lastname)=>{
				
				const store = getStore();
				const actions = getActions()

				const requestOptions = {
					method: "PUT",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({
						"name":name,
						"lastname":lastname,
						"email":email,
						"password":password}),
				  };
				  
				  fetch(`${process.env.BACKEND_URL}/api/lector/`+idLector, requestOptions)
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
			loginAdmin: (email, password) => {
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						"email": email,
						"password": password
					})
				};
			
				// Hacer la petición al backend para el login
				return fetch(`${process.env.BACKEND_URL}/api/loginAdmin`, requestOptions)
					.then(response => {
						// Verificar si la respuesta fue exitosa
						if (response.status === 200) {
							return response.json();  // Si la respuesta es 200, obtener el JSON
						} else {
							throw new Error('Credenciales incorrectas');  // Si no es 200, lanzar un error
						}
					})
					.then(data => {
						// Si el token existe, guardarlo en el localStorage
						if (data.access_token) {
							localStorage.setItem("token", data.access_token);
							localStorage.setItem("userType", "admin");  // Guardar tipo de usuario como "admin"
							setStore({
								auth: true,
								userEmail: email,
								userType: "admin"
							});
						}
					})
					.catch(error => {
						// Lanzar el error para manejarlo en el componente
						throw error.message;  // Devolver el mensaje de error
					});
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
			getCategories:()=>{

				  fetch(`${process.env.BACKEND_URL}/api/category`)
					.then((response) => {
						console.log(response)
						if(response.ok){
							return response.json()
						}
					})
					.then((result) => {
						if(result){
							setStore({categories:result})
							return true
						}
					})
					
			},
			addCategory:(name)=>{
				console.log(name)
				const store = getStore()
				const actions = getActions()
				const requestOptions = {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({"name":name}),
				  };
				  
				  fetch(`${process.env.BACKEND_URL}/api/category`, requestOptions)
					.then((response) => {
						console.log(response)
						if(response.ok){
							return response.json()
						}
					})
					.then((result) => {
						if(result){
							setStore({categories: store.categories.concat(result.category)})
							return true
						}
					})
					
			},
			editCategory:(editCategory, idCategory)=>{
				console.log("Edito categoria id: "+idCategory)
				const store = getStore();
				const actions = getActions()

				const requestOptions = {
					method: "PUT",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(editCategory),
				  };
				  
				  fetch(`${process.env.BACKEND_URL}/api/category/`+idCategory, requestOptions)
				  .then((response) => {
					console.log(response)
					if(response.ok){
						return response.json()
					}
				})
				.then((result) => {
					if(result){
						setStore(store.categories.concat(result))
						return true
					}
				})

			},
			deleteCategory: (idCategory) => {
				const store = getStore();
				
				const requestOptions = {
					method: "DELETE",
					redirect: "follow"
				  };
				  
				  fetch(`${process.env.BACKEND_URL}/api/category/`+idCategory, requestOptions)
					.then((response) => response.text())
					.then((result) => {
						console.log(result)
					})
			},
			addAutor:(name)=>{
				console.log(name)
				const store = getStore()
				const actions = getActions()
				const requestOptions = {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({"name":name}),
				  };
				  
				  fetch(`${process.env.BACKEND_URL}/api/autor`, requestOptions)
					.then((response) => {
						console.log(response)
						if(response.ok){
							return response.json()
						}
					})
					.then((result) => {
						if(result){
							setStore({autores:store.autores.concat(result.autor)})
							return true
						}
					})
					
			},
			editAutor:(editAutor, idAutor)=>{
				console.log("Edito autor id: "+idCategory)
				const store = getStore();
				const actions = getActions()

				const requestOptions = {
					method: "PUT",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(editAutor),
				  };
				  
				  fetch(`${process.env.BACKEND_URL}/api/autor/`+idAutor, requestOptions)
				  .then((response) => {
					console.log(response)
					if(response.ok){
						return response.json()
					}
				})
				.then((result) => {
					if(result){
						setStore(store.autores.concat(result))
						return true
					}
				})

			},
			deleteCategory: (idAutor) => {
				const store = getStore();
				
				const requestOptions = {
					method: "DELETE",
					redirect: "follow"
				  };
				  
				  fetch(`${process.env.BACKEND_URL}/api/autor/`+idAutor, requestOptions)
					.then((response) => response.text())
					.then((result) => {
						console.log(result)
					})
			},
			getBooks: async () => {
				let isMounted = true; 
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/book");
					const data = await response.json();
					if (isMounted) {
						setStore({ books: data });
					}
				} catch (error) {
					console.log("Error fetching books", error);
				}
				return () => {
					isMounted = false; 
				};
			},
			getAutorDetails: (autorName) => {
				console.log(autorName)
				const requestOptions = {
					method: "GET",
					redirect: "follow"
				  };
				  
				  fetch(`https://openlibrary.org/search/authors.json?q=${autorName}`, requestOptions)
					.then((response) => response.json())
					.then((result) => setStore({autorDetail:result}))
					.catch ((error) => console.log("Error getting autor details", error))
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
			addAdmin:(email,password,name,lastName)=>{
				console.log(email,password,name,lastName)
				const store = getStore()
				const actions = getActions()
				const requestOptions = {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({"name":name,"lastName":lastName,"email":email,"password":password}),
				  };
				  
				  fetch(`${process.env.BACKEND_URL}/api/booksyAdmin`, requestOptions)
					.then((response) => {
						console.log(response)
						if(response.ok){
							return response.json()
						}
					})
					.then((result) => {
						if(result){
							setStore(store.administradores.concat(result))
							return true
						}
					})
					
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
						localStorage.setItem("lectorName", data.name);
						localStorage.setItem("userType", "lector");  // Agregar userType a localStorage
						localStorage.setItem("lectorId", data.id);
			
						setStore({
							auth: true,
							userType: "lector",  // Setear el userType en el store
							lectorName: data.name,
							userEmailLector: email,
							lectorId: data.id,
							favorites: [], 
							wishlist: []   
						});
			
						await getActions().getFavorites(data.id);
						await getActions().getWishlist(data.id);
			
						return true;
					} else {
						console.error("Login failed", response.status);
						const errorData = await response.json();
						console.error("Error details:", errorData);
						return false;
					}
				} catch (error) {
					console.error("Error logging in", error);
					return false;
				}
			},
			
		
			logoutLector: () => {
				localStorage.removeItem("token");
				localStorage.removeItem("lectorName");
				localStorage.removeItem("lectorId");
				localStorage.removeItem("userType"); 
				setStore({ auth: false, lectorName: "", lectorId: null, userType: "" });  
			},

			logoutAdmin: () => {
				localStorage.removeItem("token");
				localStorage.removeItem("lectorName");
				localStorage.removeItem("lectorId");
				localStorage.removeItem("userType"); 
				setStore({ auth: false, lectorName: "", lectorId: null, userType: "" });  
			},
			

			getFavorites: async (lectorId) => {
				const favoritesResponse = await fetch(`${process.env.BACKEND_URL}/api/lector/${lectorId}/favorites`);
				const favorites = await favoritesResponse.json();
				setStore({ favorites: favorites.map(fav => fav.book_id) });
			},
			getWishlist: async (lectorId) => {
				const wishlistResponse = await fetch(`${process.env.BACKEND_URL}/api/lector/${lectorId}/wishlist`);
				const wishlist = await wishlistResponse.json();
				setStore({ wishlist: wishlist.map(item => item.book_id) });
			},

			toggleFavorite: async (bookId) => {
				const store = getStore();
				const lectorId = store.lectorId;
			
				if (!lectorId) {
					console.error("lectorId is undefined. Please log in.");
					return;
				}
			
				console.log("Favorites before usage:", store.favorites);
			
				if (!Array.isArray(store.favorites)) {
					console.error("Favorites is not an array");
					return;
				}
			
				
				const isFavorite = store.favorites.includes(bookId);
			
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/lector/${lectorId}/favorites/${bookId}`, {
						method: isFavorite ? 'DELETE' : 'POST'
					});
			
					if (!response.ok) {
						console.error(`Error al ${isFavorite ? 'eliminar' : 'agregar'} de favoritos:`, response.status);
						return;
					}
			
					const updatedFavorites = isFavorite
						? store.favorites.filter(id => id !== bookId) 
						: [...store.favorites, bookId]; 
			
					
					setStore({ favorites: updatedFavorites });
					localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
			
				} catch (error) {
					console.error("Error en la solicitud:", error);
				}
			},
			
			toggleWishlist: async (bookId) => {
				console.log("toggleWishlist called with bookId:", bookId);
				const store = getStore();
				const lectorId = store.lectorId;
			
				if (!lectorId) {
					console.error("lectorId is undefined. Please log in.");
					return;
				}
			
				console.log("Wishlist before usage:", store.wishlist);
			
				if (!Array.isArray(store.wishlist)) {
					console.error("Wishlist is not an array");
					return;
				}
			
				
				const isInWishlist = store.wishlist.includes(bookId);
			
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/lector/${lectorId}/wishlist/${bookId}`, {
						method: isInWishlist ? 'DELETE' : 'POST'
					});
			
					if (!response.ok) {
						console.error(`Error al ${isInWishlist ? 'eliminar' : 'agregar'} a la wishlist:`, response.status);
						return;
					}
			
					const updatedWishlist = isInWishlist
						? store.wishlist.filter(id => id !== bookId)
						: [...store.wishlist, bookId]; 
			
					
					setStore({ wishlist: updatedWishlist });
					localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
			
				} catch (error) {
					console.error("Error en la solicitud:", error);
				}
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
					
					
					const currentReviews = getStore().reviews;
					const updatedReviews = [...currentReviews, data]; // Agregar la nueva reseña
					setStore({ reviews: updatedReviews });
					localStorage.setItem('reviews', JSON.stringify(updatedReviews)); // Guardar en localStorage
				
					return data; 
				} catch (error) {
					console.error("Error en la solicitud:", error);
				}
			},
			
			getReviews: async (id_book=null) => {
                try {
                     await fetch(`${process.env.BACKEND_URL}/api/reviews`)
					 .then(response => {

						if(response.ok){
							return response.json()
						}
					 })
					 .then((data)=>{ 

						 if (id_book) {							 
							 const filteredReviews = data.filter(book => book.id_book == id_book)
							 setStore({ reviews: filteredReviews });
							 return;
						 }
						 setStore({ reviews: data });
					 })
                } catch (error) {
                    console.log("Error fetching reviews", error);
                }
            	},
				getLector: async () => {
					try {
						const response = await fetch(`${process.env.BACKEND_URL}/api/lector`);
						const data = await response.json();
						console.log("Lector data fetched:", data[0]);  
						setStore({ lector: data[0] });
					} catch (error) {
						console.log("Error fetching lector:", error);
					}
            },	
				
				getCritico: async () => {
					try {
						const response = await fetch(`${process.env.BACKEND_URL}/api/critico`);
						const data = await response.json();
						console.log("Critico data fetched:", data); 
						setStore({ critico: data [0] });
					} catch (error) {
						console.log("Error fetching critic:", error);
					}
				}
				
            },	
			
		}
	};

export default getState;
