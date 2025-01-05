import React, { useState } from "react";
import "../Page/css/Menu1.css";

function Menu1({ userId = "sm" }) {
  const [selectedTags, setSelectedTags] = useState([]);

  const tags = [
    "영화",
    "음악",
    "운동",
    "독서",
    "요리",
    "여행",
    "쇼핑",
    "게임",
    "코딩",
    "사진",
  ];

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      // 이미 선택된 태그를 다시 클릭하면 선택 해제
      setSelectedTags(selectedTags.filter((selected) => selected !== tag));
    } else {
      // 태그 추가
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="menu1-container">
      <h1>
        <span className="username">{userId}</span>님, 관심사를 선택해주세요.
      </h1>
      <div className="tags-container">
        {tags.map((tag, index) => (
          <button
            key={index}
            className={`tag-button ${
              selectedTags.includes(tag) ? "selected" : ""
            }`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Menu1;
