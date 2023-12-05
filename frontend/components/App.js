import React, { useState, useEffect } from 'react'
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

  const currentArticle = currentArticleId !== undefined ? articles.find(article => article.article_id === currentArticleId) : null;

  

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

      localStorage.setItem("token", response.data.token);
      setMessage(response.data.message);
      
      setSpinnerOn(false);
      navigate('/articles')

    } catch (error) {
      setMessage('Login failed: Network error');
    } finally {
      setSpinnerOn(false);
    }
  };
  
  const getArticles = async () => {

      // //   // ✨ implement
  // //   // We should flush the message state, turn on the spinner
  // //   // and launch an authenticated request to the proper endpoint.
  // //   // On success, we should set the articles in their proper state and
  // //   // put the server success message in its proper state.
  // //   // If something goes wrong, check the status of the response:
  // //   // if it's a 401 the token might have gone bad, and we should redirect to login.
  // //   // Don't forget to turn off the spinner!

    setMessage(''); 
    setSpinnerOn(true); 

    axiosWithAuth().get(articlesUrl).then(res => {
      setMessage(res.data.message)
      console.log(res)
      setArticles(res.data.articles)
      setSpinnerOn(false)
      
    }).catch(err => {
      console.log(err)
    })


  };

  const postArticle = async (article, setValues) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.

    setMessage(''); 
    setSpinnerOn(true); 

    const data = {
      title: article.title,
      text: article.text,
      topic: article.topic,
    };

    axiosWithAuth().post(articlesUrl, data).then(res => {
      console.log("postARTICLE", res)
      setMessage(res.data.message)
      setSpinnerOn(false)
      setArticles(prevArticles => [...prevArticles, res.data.article]);
    }).catch(err => {
      console.log(err)
    })

    };
    

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!

    setMessage(''); 
    setSpinnerOn(true); 

    axiosWithAuth().put(`${articlesUrl}/${article_id}`, article).then(res => {
      console.log("UPDATE,", res)
      setArticles(prevArticles => prevArticles.map(a => {
              return a.article_id === article_id ? res.data.article : a;
            }));
      setMessage(res.data.message)
      setSpinnerOn(false)
      setCurrentArticleId(null)

    }).catch(err => {
      console.log(err)
    })

  }

  const deleteArticle = article_id => {
    // ✨ implement

    setMessage(''); 
    setSpinnerOn(true); 

    axiosWithAuth().delete(`${articlesUrl}/${article_id}`).then(res => {
      console.log(res)
      setArticles(prevArticles => prevArticles.filter(article => article.article_id !== article_id));
      setMessage(res.data.message);
      setSpinnerOn(false)
    }).catch(err => {
      console.log(err)
    })
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
              currentArticle={currentArticle}
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