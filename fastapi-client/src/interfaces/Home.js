import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const most_used_tags = [
  "Blockchain", "Data Science", "Technology", "Programming", "Poetry", "Politics",
  "Bitcoin", "Machine Learning", "Cryptocurrency", "Writing", "Startup", "Life",
  "Covid 19", "Life Lessons", "Python", "Software Development", "Self Improvement",
  "Love", "Business", "JavaScript", "Culture", "Design", "Artificial Intelligence",
  "Relationships", "Web Development", "Health", "Self", "Mental Health",
  "Entrepreneurship", "Education", "Ethereum", "Marketing", "History",
  "Social Media", "Music", "Creativity", "Humor", "Psychology", "Travel",
  "Productivity", "Parenting", "Science", "UX", "Fiction", "Coronavirus",
  "Data Visualization", "Digital Marketing", "Art", "Work", "Family"
];

function Home() {
  const [userName, setUserName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const navigate = useNavigate();

  const handleTopicClick = (topic) => {
    setSelectedTopics((prevTopics) =>
      prevTopics.includes(topic)
        ? prevTopics.filter((t) => t !== topic) // Remove if already selected
        : [...prevTopics, topic] // Add if not selected
    );
  };

  const createUser = async () => {
    const response = await fetch("http://localhost:8000/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        preferred_topics: selectedTopics,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error:', error);
      return;
    }

    const data = await response.json();
    console.log("User created:", data);

    navigate("/articles", { state: { userData: data } });
  };

  return (
    <div className='w-full h-screen bg-[#FFF2D8]'>
      <h1 className='text-xl text-center font-semibold text-[#113946] '>
        AZUL to your digital library.
      </h1>

      <div className="bg-[#FFF2D8] p-6">
        <div className=" mx-auto w-300  shadow-lg rounded-lg p-6 space-y-6 bg-[#FFFBF0]">
          <div>
            <label className="block text-gray-700 font-medium mb-2">UserName</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-[#113946]"
            />
          </div>

          <div>
            <label className="block text-[#113946] font-medium mb-2">
              Choose the topics you want to see in your feed.
            </label>
            <div className="flex flex-wrap gap-2 mx-auto">
              {most_used_tags.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicClick(topic)}
                  className={`py-2 px-4 rounded-full text-sm font-medium transition ${
                    selectedTopics.includes(topic)
                      ? "bg-[#BCA37F] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-[#EAD7BB]"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={createUser}
            className="w-full mt-2 bg-[#1D4E63] text-white py-2 px-4 rounded hover:bg-[#113946]"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
