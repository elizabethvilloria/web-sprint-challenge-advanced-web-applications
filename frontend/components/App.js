import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { 
    navigate('/')
   }
  const redirectToArticles = () => { 
    navigate('/articles')
   }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      setMessage('Goodbye!');
      navigate('/');
    }
  }

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!

    setMessage('');
    setSpinnerOn(true);
  
    try {
      // Use axiosWithAuth for authenticated requests
      const response = await axiosWithAuth().post(loginUrl, {
        username,
        password,
      });
  
      if (response.status === 200) {
        const data = response.data;
        console.log('Login successful:', data.message);
        localStorage.setItem('token', data.token);
        console.log('Token set in local storage:', data.token);
        navigate('/articles');
        setMessage(data.message);
        // await getArticles();
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Login failed: Network error');
    } finally {
      setSpinnerOn(false);
    }
  };
  


  // const getArticles = async () => {

  // //   // ✨ implement
  // //   // We should flush the message state, turn on the spinner
  // //   // and launch an authenticated request to the proper endpoint.
  // //   // On success, we should set the articles in their proper state and
  // //   // put the server success message in its proper state.
  // //   // If something goes wrong, check the status of the response:
  // //   // if it's a 401 the token might have gone bad, and we should redirect to login.
  // //   // Don't forget to turn off the spinner!

  //   // setMessage('');
  //   // setSpinnerOn(true);
  
  //   // try {
  //   //   const token = localStorage.getItem('token');
  //   //   console.log('Token:', token);
  //   //   const response = await axiosWithAuth().get(articlesUrl);
  
  //   //   if (response.status === 200) {
  //   //     const articlesData = response.data;
  //   //     setArticles(articlesData);
  //   //     setMessage('Articles fetched successfully');
  //   //   } else {
  //   //     setMessage('Error fetching articles');
  //   //   }
  //   // } catch (error) {
  //   //   console.error('Error while fetching articles:', error);
  //   //   if (error.response && error.response.status === 401) {
  //   //     redirectToLogin();
  //   //   } else {
  //   //     setMessage('Network error while fetching articles');
  //   //   }
  //   // } finally {
  //   //   setSpinnerOn(false);
  //   // }
  // };
  
  const getArticles = async () => {
    setMessage(''); 
    setSpinnerOn(true); 
  
    try {
      const token = localStorage.getItem('token');
      console.log('Token for article fetching:', token); 
  
      const response = await axiosWithAuth().get(articlesUrl);
  
      if (response.status === 200) {
        const articlesData = response.data;
        setArticles(articlesData);
        setMessage('Articles fetched successfully');
      } else {
        setMessage('Error fetching articles');
      }
    } catch (error) {
      console.error('Error while fetching articles:', error);
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage('Network error while fetching articles');
      }
    } finally {
      setSpinnerOn(false);
    }
  };

  const postArticle = async article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.

    
    };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinning={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout} >Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
              postArticle={postArticle}
              updateArticle={updateArticle}
              currentArticle={articles.find(article => article.article_id === currentArticleId)}
              setCurrentArticleId={setCurrentArticleId}
              />
              <Articles 
              articles={articles}
              getArticles={getArticles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}
              currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}