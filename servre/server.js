const axios = require("axios");
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const mysql = require('mysql2/promise'); // mysql2 패키지 사용
const bcrypt = require('bcrypt'); // 비밀번호 암호화를 위한 bcrypt
require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors');

async function getTopVideo(channelId) {
  try {
    const searchResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          channelId: channelId,
          part: "snippet",
          maxResults: 1,
          order: "viewCount", // 인기 있는 영상 기준으로 정렬
        },
      }
    );

    const video = searchResponse.data.items[0];
    if (!video) return null;

    // 동영상의 추가 정보를 가져오기 위해 videoId 사용
    const videoId = video.id.videoId;
    const videoDetailsResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          id: videoId,
          part: "snippet,statistics",
        },
      }
    );

    const videoDetails = videoDetailsResponse.data.items[0];
    if (!videoDetails) return null;

    return {
      videoId: videoId,
      title: videoDetails.snippet.title,
      thumbnail: videoDetails.snippet.thumbnails.medium.url,
      viewCount: videoDetails.statistics.viewCount,
    };
  } catch (error) {
    console.error("대표 영상 가져오기 중 오류:", error);
    return null;
  }
}

// YouTube API 키
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080; // Elastic Beanstalk PORT 설정 사용

// Load credentials from environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// Initialize OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

app.use(bodyParser.json());

// Create a MySQL connection pool
// const db = mysql.createPool({
//   host: process.env.DB_HOST,        // e.g., 'localhost' 또는 EC2의 IP 주소
//   user: process.env.DB_USER,        // MySQL 사용자 이름
//   password: process.env.DB_PASSWORD, // MySQL 사용자 비밀번호
//   database: process.env.DB_NAME,    // 'user_data' 데이터베이스 이름
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// app.get('/db-test', async (req, res) => {
//   try {
//     // MySQL 연결 테스트
//     const [rows] = await db.query('SELECT 1');
//     res.status(200).send('MySQL 연결 성공!');
//   } catch (error) {
//     console.error('MySQL 연결 오류:', error);
//     res.status(500).send('MySQL 연결 실패');
//   }
// });

// Generate the auth URL dynamically
app.get('/login', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    redirect_uri: REDIRECT_URI, // 명시적으로 추가
  });
  res.redirect(authUrl);
});

// Handle OAuth2 callback
app.get('/redirect', async (req, res) => {
  
  const code = req.query.code;
  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Fetch user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    const user = userInfo.data; // Google에서 가져온 사용자 정보
    
    // Save the user info into the database
  //   const query = `
  //   INSERT INTO users (google_id, email, name, picture)
  //   VALUES (?, ?, ?, ?)
  //   ON DUPLICATE KEY UPDATE
  //     email = VALUES(email),
  //     name = VALUES(name),
  //     picture = VALUES(picture);
  // `;
  
    // Insert or update user info
    // const [result] = await db.query(query, [user.id, user.email, user.name, user.picture]);
    
    // console.log('User info saved to database:', result);
  
    // Respond with user info
    res.json({ user });
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send('Authentication failed');
  }
});

// 회원가입 API
// app.post('/join', async (req, res) => {
//   const { userid, password, firstName, lastName } = req.body;

//   // 입력 검증
//   if (!userid || !password || !firstName || !lastName) {
//     return res.status(400).send('모든 필드를 입력하세요.');
//   }

//   try {
//     // 사용자 중복 확인
//     const [rows] = await db.query('SELECT id FROM users WHERE userid = ?', [userid]);
//     if (rows.length > 0) {
//       return res.status(400).send('이미 존재하는 아이디입니다.');
//     }

//     // 비밀번호 암호화
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 데이터베이스 삽입
//     const query = `
//       INSERT INTO users (userid, password, name)
//       VALUES (?, ?, ?)
//     `;
//     await db.query(query, [userid, hashedPassword, `${firstName} ${lastName}`]);

//     res.status(201).send('회원가입 성공');
//   } catch (error) {
//     console.error('회원가입 중 오류 발생:', error);
//     res.status(500).send('서버 오류');
//   }
// });

// 로그인 API
// app.post('/auth/login', async (req, res) => {
//   const { userid, password } = req.body;

//   try {
//     // 사용자 조회
//     const [rows] = await db.query('SELECT * FROM users WHERE userid = ?', [userid]);
//     if (rows.length === 0) {
//       return res.status(401).send('아이디 또는 비밀번호가 올바르지 않습니다.');
//     }

//     const user = rows[0];

//     // 비밀번호 검증
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return res.status(401).send('아이디 또는 비밀번호가 올바르지 않습니다.');
//     }

//     // 로그인 성공 시 사용자 정보 반환
//     res.json({
//       id: user.id,
//       name: user.name,
//       createdAt: user.created_at,
//     });
//   } catch (error) {
//     console.error('로그인 중 오류 발생:', error);
//     res.status(500).send('서버 오류');
//   }
// });

// Google API 초기화
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY, // 유튜브 API 키
});

let currentOffset = 0; // 반환 범위를 관리하는 변수
const cache = {}; // 태그별 결과를 캐싱

app.post('/favorite', async (req, res) => {
  const { tags } = req.body;

  if (!tags || tags.length === 0) {
    return res.status(400).json({ error: '태그를 하나 이상 선택해주세요.' });
  }

  const cacheKey = tags.join(','); // 캐싱 키

  try {
    // DB에서 해당 태그에 대한 데이터 확인
    // const channelsFromDb = await db.query(
    //   `SELECT * FROM youtube_channels WHERE last_updated >= NOW() - INTERVAL 1 DAY`
    // );

    // let youtubeChannels = [];
    // if (channelsFromDb.length > 0) {
    //   // 캐싱된 데이터 사용
    //   youtubeChannels = channelsFromDb.map((channel) => ({
    //     name: channel.name,
    //     url: channel.url,
    //     // description: channel.description,
    //     subscribers: channel.subscribers,
    //     // viewCount: channel.view_count,
    //     // videoCount: channel.video_count,
    //     topVideo: {
    //       videoId: channel.video_id,
    //       title: channel.video_title,
    //       thumbnail: channel.thumbnail_url,
    //       viewCount: channel.video_view_count,
    //     },
    //   }));
    // } else {
      // 캐싱된 데이터가 없으면 YouTube API 호출
      const searchResults = await youtube.search.list({
        part: 'snippet',
        q: tags.join(' '),
        maxResults: 10,
        type: 'channel',
        order: 'viewCount',
      });

      const channelIds = searchResults.data.items.map(
        (channel) => channel.snippet.channelId
      );

      const channelDetails = await youtube.channels.list({
        part: 'snippet,statistics',
        id: channelIds.join(','),
      });

      youtubeChannels = await Promise.all(
        channelDetails.data.items.map(async (channel) => {
          const topVideo = await getTopVideo(channel.id);
          // DB에 데이터 저장
          // await db.query(
          //   `INSERT INTO youtube_channels (id, name, url, subscribers, last_updated)
          //   VALUES (?, ?, ?, ?, NOW())
          //   ON DUPLICATE KEY UPDATE
          //   name = VALUES(name),
          //   subscribers = VALUES(subscribers),
          //   last_updated = NOW()`,
          //   [
          //     channel.id,
          //     channel.snippet.title,
          //     `https://www.youtube.com/channel/${channel.id}`,
          //     channel.statistics.subscriberCount,
          //   ]
          // );

          if (topVideo) {
            // await db.query(
            //   `INSERT INTO youtube_videos (id, channel_id, title, thumbnail_url, view_count, last_updated)
            //   VALUES (?, ?, ?, ?, ?, NOW())
            //   ON DUPLICATE KEY UPDATE
            //   title = VALUES(title),
            //   thumbnail_url = VALUES(thumbnail_url),
            //   view_count = VALUES(view_count),
            //   last_updated = NOW()`,
            //   [
            //     topVideo.videoId,
            //     channel.id,
            //     topVideo.title,
            //     topVideo.thumbnail,
            //     topVideo.viewCount,
            //   ]
            // );
          }

          return {
            name: channel.snippet.title,
            url: `https://www.youtube.com/channel/${channel.id}`,
            // description: channel.snippet.description,
            subscribers: channel.statistics.subscriberCount,
            // viewCount: channel.statistics.viewCount,
            // videoCount: channel.statistics.videoCount,
            topVideo,
          };
        })
      );
    // }

    res.json({ youtubeChannels });
  } catch (error) {
    console.error('유튜브 API 요청 중 오류 발생:', error);
    res.status(500).json({ error: '유튜브 API 요청 실패' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});