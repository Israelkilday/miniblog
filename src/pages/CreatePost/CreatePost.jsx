// CSS
import styles from "./CreatePost.module.css"
// HOOKS
import { useState } from "react";
import { useInsertDocument } from "../../hooks/useInsertDocument";
// REACT-ROUTER-DOM
import { useNavigate } from "react-router-dom";
// CONTEXT
import { userAuthValue } from "../../context/AuthContext";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState("");


  const { user } = userAuthValue();

  const { insertDocument, response } = useInsertDocument("posts");

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // validate image URL
    try {
      new URL(image);
    } catch (error) {
      setFormError("A imagem precisa ser uma URL.");
    }

    // criar  user.uido array de tags
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    // checar toodos os valores
    if (!title || !image || !tags || !body) {
      setFormError("Por favor preencha todos os campos!");
    }

    if (formError) return;

    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    })

    // redirect to home page
    navigate("/");
  }

  return (
    <div className={styles.create_post}>
      <h2>Criar Post</h2>
      <p>Escreva o que quiser e compartilhe seu conhecimento!</p>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Título</span>
          <input
            type="text"
            name="title"
            placeholder="Pense em um bom título..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>

        <label>
          <span>URL da imagem</span>
          <input
            type="text"
            name="image"
            placeholder="Insira uma imagem que representa o seu post"
            onChange={(e) => setImage(e.target.value)}
            value={image}
          />
        </label>

        <label>
          <span>Conteúdo</span>
          <textarea
            name="body"
            required
            placeholder="Insira o conteúdo do post"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          >
          </textarea>
        </label>

        <label>
          <span>Tags</span>
          <input
            type="text"
            name="tags"
            placeholder="Insira as tags separados por vírgula"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />
        </label>

        {!response.loading && <button className="btn">Criar Post!</button>}

        {response.loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}

        {(response.error || formError) && (
          <p className="error">{response.error || formError}</p>
        )}
      </form>
    </div>
  )
}

export default CreatePost;