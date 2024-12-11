import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "react-slick";
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="prev-arrow absolute top-1/2 left-0 transform -translate-y-1/2 text-white p-2 bg-gray-500 rounded-full"
      onClick={onClick}
    >
      &#8592;
    </button>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="next-arrow absolute top-1/2 right-0 transform -translate-y-1/2 text-white p-2 bg-gray-500 rounded-full"
      onClick={onClick}
    >
      &#8594;
    </button>
  );
};


function Articles() {

  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = location.state || {}; // Récupération des données utilisateur
  const [recommendations, setRecommendations] = useState([]);
  const [preferredTopics, setPreferredTopics] = useState([]);
  const [articles, setArticles] = useState([]);
  const [recommendedArticles, setRecommendedArticles] = useState([]);



  const settings = {
    dots: true, // Show navigation dots
    infinite: false, // Disable infinite scroll
    speed: 500,
    slidesToShow: 1, // Show 1 "page" of 10 articles at a time
    slidesToScroll: 1,
    prevArrow: <PrevArrow />, // Custom previous arrow
    nextArrow: <NextArrow />, // Custom next arrow
  };

  const getPreviewContent = (content) => {
    const lines = content.split("\n");
    return lines.slice(0, 10).join("\n");
  };

  const handleReadMore = (article) => {
    navigate("/read_more", { state: { article } });
  };

  // Chunk the articles into groups of 10
  const chunkedArticles = [];
  for (let i = 0; i < articles.length; i += 10) {
    chunkedArticles.push(articles.slice(i, i + 10));
  }

  

  const chunkedRecommendedArticles = [];
  for (let i = 0; i < recommendedArticles.length; i += 10) {
    chunkedRecommendedArticles.push(recommendedArticles.slice(i, i + 10));
  }
  // Fonction pour créer des recommandations
  const createRecommendation = async () => {
    const topics = Array.isArray(userData?.preferred_topics)
      ? userData.preferred_topics
      : typeof userData?.preferred_topics === "string"
      ? userData.preferred_topics.split(",").map((topic) => topic.trim())
      : [];

    try {
      const response = await fetch("http://127.0.0.1:8000/recommendations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferred_topics: topics, // Envoi des sujets préférés
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Recommendations:", data);
        setRecommendations(data.recommended_articles || []); // Mettre à jour les recommandations
        setPreferredTopics(data.recommended_articles || []); // Mettre à jour les sujets préférés
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  // useEffect pour créer des recommandations lorsque les données utilisateur sont disponibles
  useEffect(() => {
    if (userData) {
      createRecommendation();
    }
  }, [userData]);

  // useEffect pour récupérer les articles préférés
  useEffect(() => {
    const fetchPreferredArticles = async () => {
      if (!preferredTopics || preferredTopics.length === 0) return;
  
      try {
        // Construction de l'URL avec les paramètres de requête
        const queryParams = preferredTopics.map((topic) => `preferred_topics=${encodeURIComponent(topic)}`).join("&");
        const url = `http://127.0.0.1:8000/articles/preferred_topics?${queryParams}`;
  
        const response = await fetch(url);
  
        if (response.ok) {
          const data = await response.json();
          setArticles(data); // Mise à jour de l'état des articles
        } else {
          console.error("Erreur dans la réponse :", await response.text());
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
      }
    };
  
    fetchPreferredArticles();
  }, [preferredTopics]);
  

  useEffect(() => {
    // Fetch recommended articles based on user_id (passed in userData)
    const fetchRecommendedArticles = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/articles/recommended?user_id=${userData.id}`
        );
        const data = await response.json();
        setRecommendedArticles(data);
      } catch (error) {
        console.error("Error fetching recommended articles:", error);
      }
    };

    if (userData) {
      fetchRecommendedArticles();
    }
  }, [userData]);





  return (
    <div className="p-24  bg-[#FFF2D8]">
      <div className="bg-[#FFFBF0] p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-[#113946]">
  Hi {userData?.name || 'Guest'}, you seem interested in these topics:
</h2>
        <p className="text-sm text-[#BCA37F] mt-2">
          {userData.preferred_topics?.join(", ") || "No topics provided"}
        </p>
      </div>



      <Slider {...settings}>
        {chunkedArticles.map((articleGroup, groupIndex) => (
          <div key={groupIndex} className="article-group ">
            {articleGroup.map((article, index) => (
              <div
                key={index}
                className="article-preview p-4 border rounded-md shadow mb-4 bg-[#FFFBF0]"
              >
                <h3 className="text-lg font-bold text-[#113946]">{article.title}</h3>
                <p className="text-sm  text-[#BCA37F]">
                  <strong>Author:</strong> {article.author}
                </p>
                <p className="text-sm  text-[#BCA37F]">
                  <strong>Tags:</strong> {article.tags.join(", ")}
                </p>
                <p className="text-base mt-2 whitespace-pre-line">
                  {getPreviewContent(article.content)}
                </p>
                <button
                  onClick={() => handleReadMore(article)}
                  className="mt-2 bg-[#1D4E63] text-white py-1 px-3 rounded hover:bg-[#113946]"
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        ))}
      </Slider>
      










<div className="bg-[#FFFBF0] p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-[#113946]">
        But we propose you these articles, we are sure that you'll like them:
        </h2>
      </div>



          <Slider {...settings}>
            {chunkedRecommendedArticles.map((articleGroup, groupIndex) => (
              <div key={groupIndex} className="article-group">
                {articleGroup.map((article, index) => (
                  <div
                    key={index}
                    className="article-preview p-4 border rounded-md shadow mb-4 bg-[#FFFBF0]"
                    >
                    <h3 className="text-lg font-bold text-[#113946]">{article.title}</h3>
                    <p className="text-sm  text-[#BCA37F]">
                      <strong>Author:</strong> {article.author}
                    </p>
                    <p className="text-sm  text-[#BCA37F]">
                      <strong>Tags:</strong> {article.tags.join(", ")}
                    </p>
                    <p className="text-base mt-2 whitespace-pre-line">
                      {getPreviewContent(article.content)}
                    </p>
                    <button
                  onClick={() => handleReadMore(article)}
                  className="mt-2 bg-[#1D4E63] text-white py-1 px-3 rounded hover:bg-[#113946]"
                >
                  Read More
                </button>
                  </div>
                ))}
              </div>
            ))}
          </Slider>
        














    </div>
  );
}

export default Articles;
