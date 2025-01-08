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

// 날짜 변환 함수
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
  const [accStats, setAccStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showViews, setShowViews] = useState(true);
  const [showSubscribers, setShowSubscribers] = useState(true);
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
      if (googleId === "104002149398543189740") {
        console.log("테스트 데이터 로드 중...");
        const response = await fetch("/apssaeChannel.json");
        if (!response.ok) throw new Error("테스트 데이터 로드 실패");

        const mockData = await response.json();
        const formattedData = mockData.accStats.map((stat) => ({
          ...stat,
          date: formatDate(stat.date), // 날짜 포맷 적용
        }));
        setChannels(mockData.channels || []);
        setAccStats(formattedData || []);
        setFilteredStats(formattedData || []);
        setStartDate(formattedData[0]?.date || "");
        setEndDate(formattedData[formattedData.length - 1]?.date || "");
        return;
      }

      const response = await fetch("http://localhost:8080/mychannel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ googleId }),
      });

      if (!response.ok) throw new Error("서버 요청 실패");

      const data = await response.json();
      const formattedData = data.accStats.map((stat) => ({
        ...stat,
        date: formatDate(stat.date), // 날짜 포맷 적용
      }));
      setChannels(data.channels || []);
      setAccStats(formattedData || []);
      setFilteredStats(formattedData || []);
      setStartDate(formattedData[0]?.date || "");
      setEndDate(formattedData[formattedData.length - 1]?.date || "");
    } catch (err) {
      console.error("오류 발생:", err);
      setError("유튜브 채널 정보를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const filterStatsByDate = () => {
    const filtered = accStats.filter(
      (stat) =>
        (!startDate || stat.date >= startDate) &&
        (!endDate || stat.date <= endDate)
    );
    setFilteredStats(filtered);
  };

  useEffect(() => {
    filterStatsByDate();
  }, [startDate, endDate]);

  const calculateYAxisRange = (key) => {
    const values = filteredStats.map((stat) => stat[key]);
    const min = Math.floor(Math.min(...values) / 10) * 10;
    const max = Math.ceil(Math.max(...values) / 10) * 10;
    return [min, max];
  };

  const yAxisRange = {
    views: calculateYAxisRange("acc_views"),
    subscribers: calculateYAxisRange("acc_subscribers"),
  };

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
        <div className="channel-list" style={{ width: "30%", marginRight: "20px" }}>
          {channels.length > 0 && (
            <ul>
              {channels.map((channel, index) => (
                <li
                  key={index}
                  className="channel-item"
                  style={{ marginBottom: "20px" }}
                >
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3>{channel.name}</h3>
                  </a>
                  <p>구독자 수: {channel.subscribers}</p>
                  <img
                    src={channel.channelPicture}
                    alt={channel.name}
                    className="channel-picture"
                    style={{
                      width: "400px",
                      height: "400px",
                      objectFit: "cover",
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="acc-stats" style={{ flex: 1 }}>
          {filteredStats.length > 0 && (
            <>
              <h2>채널 통계</h2>
              <div className="date-filter">
                <label>
                  시작 날짜:
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </label>
                <label>
                  종료 날짜:
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </label>
              </div>
              <div className="chart-controls">
                <label>
                  <input
                    type="checkbox"
                    checked={showViews}
                    onChange={() => setShowViews(!showViews)}
                  />
                  조회수 보기
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showSubscribers}
                    onChange={() => setShowSubscribers(!showSubscribers)}
                  />
                  구독자 수 보기
                </label>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    yAxisId="left"
                    domain={yAxisRange.views}
                    tickFormatter={(value) => Math.round(value)}
                  />
                  <YAxis
                    yAxisId="right"
                    domain={yAxisRange.subscribers}
                    orientation="right"
                    tickFormatter={(value) => Math.round(value)}
                  />
                  <Tooltip />
                  <Legend />
                  {showViews && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="acc_views"
                      name="누적 조회수"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  )}
                  {showSubscribers && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="acc_subscribers"
                      name="누적 구독자 수"
                      stroke="#82ca9d"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>

      <div className="video-preview-section" style={{ marginTop: "20px" }}>
        {channels.map((channel, index) => (
          channel.topVideo && (
            <div key={index} className="video-preview">
              <h4>대표 영상: {channel.topVideo.title}</h4>
              <a
                href={`https://www.youtube.com/watch?v=${channel.topVideo.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={channel.topVideo.thumbnail}
                  alt={channel.topVideo.title}
                  style={{ width: "400px", height: "400px", objectFit: "cover" }}
                />
              </a>
              <p>조회수: {channel.topVideo.viewCount}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default MyChannel;