import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function MyChannel() {
  const [googleId, setGoogleId] = useState("");
  const [channels, setChannels] = useState([]);
  const [channelStats, setChannelStats] = useState([]);
  const [filteredChannelStats, setFilteredChannelStats] = useState([]);
  const [videoStats, setVideoStats] = useState([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showViews, setShowViews] = useState(true); // 누적 조회수 상태 추가
  const [showSubscribers, setShowSubscribers] = useState(true); // 누적 구독자 수 상태 추가
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setGoogleId(e.target.value);
  };

  const handleFetchChannels = async () => {
    if (!googleId.trim()) {
      alert("Google ID를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/mychannel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ googleId }),
      });

      if (!response.ok) throw new Error("서버 요청 실패");

      const data = await response.json();

      const formattedChannelStats = (data.accStats || []).map((stat) => ({
        ...stat,
        date: formatDate(stat.date),
      }));

      const formattedVideoStats = (data.videoStats || []).map((stat) => ({
        ...stat,
        date: formatDate(stat.date),
      }));

      setChannels(data.channels || []);
      setChannelStats(formattedChannelStats);
      setVideoStats(formattedVideoStats);
      setFilteredChannelStats(formattedChannelStats);
      setStartDate(formattedChannelStats[0]?.date || "");
      setEndDate(formattedChannelStats[formattedChannelStats.length - 1]?.date || "");
    } catch (err) {
      console.error("오류 발생:", err);
      setError("유튜브 채널 정보를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const filterChannelStatsByDate = () => {
    const filtered = channelStats.filter(
      (stat) =>
        (!startDate || new Date(stat.date) >= new Date(startDate)) &&
        (!endDate || new Date(stat.date) <= new Date(endDate))
    );
    setFilteredChannelStats(filtered);
  };

  useEffect(() => {
    filterChannelStatsByDate();
  }, [startDate, endDate]);

  const handlePreviousVideo = () => {
    setSelectedVideoIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : channels[0].videos.length - 1
    );
  };

  const handleNextVideo = () => {
    setSelectedVideoIndex((prevIndex) =>
      prevIndex < channels[0].videos.length - 1 ? prevIndex + 1 : 0
    );
  };

  const selectedVideo = channels[0]?.videos?.[selectedVideoIndex] || null;

  const selectedVideoStats = videoStats.filter(
    (stat) => stat.video_id === selectedVideo?.videoId
  );

  return (
    <div className="my-channel-container">
      <div className="input-section" style={{ marginBottom: "20px" }}>
        <h1>내 유튜브 채널</h1>
        <div>
          <input
            type="text"
            value={googleId}
            onChange={handleInputChange}
            placeholder="Google ID를 입력하세요"
            disabled={loading}
          />
          <button onClick={handleFetchChannels} disabled={loading}>
            {loading ? "로딩 중..." : "채널 정보 가져오기"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start" }}>
      <div className="sidebar" style={{ width: "30%", marginRight: "20px" }}>
  {channels.length > 0 && (
    <div>
      <h2>채널 정보</h2>
      <ul>
        {channels.map((channel, index) => (
          <li key={index} className="channel-item" style={{ marginBottom: "20px" }}>
            {/* 채널 사진 */}
            <img
              src={channel.channelPicture}
              alt={`${channel.name} 사진`}
              style={{ width: "50px", height: "50px", borderRadius: "50%", marginBottom: "10px" }}
            />
            {/* 채널 이름 */}
            <h3>
              <a href={channel.url} target="_blank" rel="noopener noreferrer">
                {channel.name}
              </a>
            </h3>
            {/* 구독자 수 */}
            <p>구독자 수: {channel.subscribers}</p>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>


<div style={{ flex: 1 }}>
  <h2>채널 통계</h2>

  {/* 체크박스 섹션 */}
  <div style={{ marginBottom: "20px" }}>
    <label style={{ marginRight: "10px" }}>
      <input
        type="checkbox"
        checked={showViews}
        onChange={() => setShowViews((prev) => !prev)}
      />
      누적 조회수 보기
    </label>
    <label>
      <input
        type="checkbox"
        checked={showSubscribers}
        onChange={() => setShowSubscribers((prev) => !prev)}
      />
      누적 구독자 수 보기
    </label>
  </div>

  {/* 그래프 섹션 */}
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={filteredChannelStats}>
      {/* 격자선 */}
      <CartesianGrid strokeDasharray="3 3" />
      {/* x축 */}
      <XAxis dataKey="date" />
      {/* y축 - 누적 조회수 */}
      <YAxis
        yAxisId="left"
        label={{ value: "누적 조회수", angle: -90, position: "insideLeft" }}
      />
      {/* y축 - 누적 구독자 수 */}
      <YAxis
        yAxisId="right"
        orientation="right"
        label={{ value: "누적 구독자 수", angle: -90, position: "insideRight" }}
      />
      {/* 툴팁 */}
      <Tooltip />
      {/* 범례 */}
      <Legend />
      {/* 누적 조회수 라인 - 체크박스 상태에 따라 표시 */}
      {showViews && (
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="acc_views"
          stroke="#8884d8"
          name="누적 조회수"
          activeDot={{ r: 8 }}
        />
      )}
      {/* 누적 구독자 수 라인 - 체크박스 상태에 따라 표시 */}
      {showSubscribers && (
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="acc_subscribers"
          stroke="#82ca9d"
          name="누적 구독자 수"
        />
      )}
    </LineChart>
  </ResponsiveContainer>
</div>


      </div>

      <div className="bottom-section" style={{ display: "flex", marginTop: "20px" }}>
        <div style={{ flex: 1 }}>
          <h2>동영상별 통계</h2>
          {selectedVideo && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={selectedVideoStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="acc_views" stroke="#8884d8" name="누적 조회수" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ width: "30%", textAlign: "center" }}>
          <button onClick={handlePreviousVideo}>← 이전</button>
          <button onClick={handleNextVideo}>다음 →</button>
          {selectedVideo && (
            <div style={{ marginTop: "10px" }}>
              <h4>{selectedVideo.title}</h4>
              <img src={selectedVideo.thumbnail} alt={selectedVideo.title} style={{ width: "100%" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyChannel;
