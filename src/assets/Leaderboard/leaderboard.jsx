import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { getValidToken } from "../../Utils/auth";
import "./leaderboard.css";

const placeholderTeams = [
  { team_name: "Loading...", total_points: 0, rank: 1 },
  { team_name: "Loading...", total_points: 0, rank: 2 },
  { team_name: "Loading...", total_points: 0, rank: 3 },
  { team_name: "Loading...", total_points: 0, rank: 4 },
  { team_name: "Loading...", total_points: 0, rank: 5 },
];

function Leaderboard() {
  const [teams, setTeams] = useState(placeholderTeams);

  useEffect(() => {
    const fetchTeams = async () => {
      try {

        const accessToken = await getValidToken();
        
        const res = await fetch("http://localhost:8000/api/leaderboard/leaderboard/", {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) throw new Error("Server error");

        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          setTeams(result.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchTeams();

    const interval = setInterval(fetchTeams, 5000);
    return () => clearInterval(interval);
  }, []);

  const sortedTeams = [...teams].sort(
    (a, b) => Number(b.total_points) - Number(a.total_points)
  );

  const RankCard = ({
    rank,
    team,
    rectImg,
    pfpImg,
    stampImg,
    cardClass,
    stampClass,
  }) => (
    <div className={`card-container ${cardClass}`}>
      <img src="/link.png" className="decoration link" alt="link" />
      <img src="/pin.png" className="decoration pin" alt="pin" />
      <img src="/loop.png" className="decoration loop" alt="loop" />
      <img src={`/${rectImg}`} className="card-bg" alt="paper" />

      <div className="card-content">
        <span className="rank-number">#{rank}</span>

        <img
          src={`/${pfpImg}`}
          className="pfp-img"
          alt="profile"
        />

        <h3 className="team-name-display">
          {team?.team_name || "N/A"}
        </h3>

        <p className="score-display">
          Current Score{" "}
          <span>{team?.total_points || 0} PTS</span>
        </p>
      </div>

      <img
        src={`/${stampImg}`}
        className={`stamp ${stampClass}`}
        alt="stamp"
      />
    </div>
  );

  return (
    <div className="leaderboard-wrapper">
      {/* Header */}
      <header className="header-section">
        <h1 className="main-title">Leaderboard</h1>
        <p className="subtitle">
          The game is afoot, Track the progress of brilliant minds
          <br />
          solving our mysteries
        </p>
      </header>

      {/* Top 3 */}
      <div className="top-three-section">
        <RankCard
          rank={2}
          team={sortedTeams[1]}
          rectImg="rectangle2.png"
          pfpImg="pfp2.png"
          stampImg="c2.png"
          cardClass="rotate-right"
          stampClass="stamp-c2"
        />

        <RankCard
          rank={1}
          team={sortedTeams[0]}
          rectImg="rectangle1.png"
          pfpImg="pfp1.png"
          stampImg="c1.png"
          cardClass="center-card"
          stampClass="stamp-c1"
        />

        <RankCard
          rank={3}
          team={sortedTeams[2]}
          rectImg="rectangle3.png"
          pfpImg="pfp3.png"
          stampImg="c3.png"
          cardClass="rotate-left"
          stampClass="stamp-c3"
        />

        
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team name</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            {sortedTeams.map((team, index) => (
              <tr key={index}>
                <td className="rank-cell">
                  #{team.rank || index + 1}
                </td>

                <td className="team-name-cell">
                  {team.team_name}
                </td>

                <td>{team.total_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer className="footer-quote">
        <p id="data">
          “Data! Data! Data! , I can’t make bricks without clay”
        </p>
        <p id="sherlock">Sherlock Holmes</p>
      </footer>
    </div>
  );
}

export default Leaderboard;
