import { useEffect, useState } from 'react'
import Game from './components/Game'

export const HOST = 'https://flamin-finger-backend.fly.dev'

function App() {
  //TODO don't use any type
  const [user, setUser] = useState<any>(null);
  const [highscore, setHighscore] = useState(0);

  const fetchUserInfo = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('token')) {
      localStorage.setItem('token', searchParams.get('token')!);
    }

    if (localStorage.getItem('token')) {
      try {
        const resp = await fetch(`${HOST}/api/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const json = await resp.json();

        if (json.username) {
          localStorage.setItem('user', JSON.stringify(json));
          loadUser();
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  const loadUser = () => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user')!);
      setUser(user);
      setHighscore(Number(user?.highscore) | 0);
    }
  }

  const submitScore = async (score: number) => {
    if (score > highscore) {
      setHighscore(score);
      if (localStorage.getItem('token')) {
        try {
          await fetch(`${HOST}/submit`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'score': score.toString(),
            }
          });
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  useEffect(() => {
    loadUser();
    fetchUserInfo();
  }, []);

  return (
    <>
      <div className="header">
        <button className="play hidden">Back To Game</button>
        <button className="leaderboard">Leaderboard</button>
        {user
          ? <div className="user">{`${user.name} (${user.username})`}</div>
          : <button className="sign-in"><a href={`${HOST}/login`}>Sign In</a></button>
        }
      </div>
      <div className="cabinet">
        <Game submitScore={submitScore} />
        <div className="scores hidden"></div>
      </div>
    </>
  )
}

export default App
