import React, { useState } from "react";
import "../Page/css/Favorite.css";

function Menu1({ userId = "sm" }) {
  const [selectedTags, setSelectedTags] = useState([]);

  const tags = [
    "영화",
    "K-pop",
    "힙합",
    "운동",
    "책 리뷰 및 추천",
    "요리",
    "역사와 문화",
    "과학 이야기",
    "여행",
    "쇼핑",
    "게임",
    "프로그래밍 및 코딩",
    "사진",
    "외국어 배우기",
    "웹툰 및 웹소설",
    "기기 리뷰",
    "인공지능 및 로봇",
    "주식 및 투자",
    "재테크",
    "스타트업",
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
