import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm({
  postArticle,
  updateArticle,
  setCurrentArticleId,
  currentArticle
}) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here

  useEffect(() => {
    if (currentArticle) {
      setValues(currentArticle);
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticle]);

  const onChange = evt => {
    const { id, value } = evt.target
    console.log(id, value)
    setValues({ ...values, [id]: value })
  }


  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
    if (currentArticle) {
      updateArticle({ article_id: currentArticle.article_id, article: values });
      setCurrentArticleId(null);
    } else {
      postArticle(values);
    }
    setValues(initialFormValues)
  };
  

  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values
    return !values || !values.title || !values.text || !values.topic ||
    !values.title.trim() || !values.text.trim() || !values.topic.trim();
  }

  const cancelEdit = () => {
    setCurrentArticleId(null);
    setValues(initialFormValues);
  };

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? 'Edit Article' : 'Create Article'}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">{currentArticle ? 'Submit' : 'Submit'}</button>
        {currentArticle && (<button type="button" onClick={cancelEdit}>Cancel Edit</button>)}      
    </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
