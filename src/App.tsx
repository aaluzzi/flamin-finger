import { useEffect, useState } from 'react'
import Leaderboard from './components/Leaderboard';
import TouchGame from './components/TouchGame';
import MouseGame from './components/MouseGame';

export const HOST = 'https://flamin-finger-backend.fly.dev'

function App() {
  //TODO don't use any type
  const [user, setUser] = useState<any>(null);
  const [highscore, setHighscore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

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
      if ('ontouchstart' in window) {
        setHighscore(Number(user?.touchHighscore) | 0);
      } else {
        setHighscore(Number(user?.mouseHighscore) | 0);
      }
     
    }
  }

  const submitScore = async (type: 'mouse' | 'touch', score: number) => {
    if (score > highscore) {
      setHighscore(score);
      if (localStorage.getItem('token')) {
        try {
          await fetch(`${HOST}/submit/${type}`, {
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
      <div className="text-white h-12 w-full py-4 px-6 bg-stone-900 flex justify-between items-center">
        <button className="hover:underline" onClick={() => setShowLeaderboard(showLeaderboard => !showLeaderboard)}>
          {showLeaderboard ?
            "Back To Game"
            : "Leaderboard"
          }
        </button>
        {user
          ? <div>{`${user.name} (${user.username})`}</div>
          : <button className="hover:underline"><a href={`${HOST}/login`}>Sign In</a></button>
        }
      </div>
      <div className="flex-1 max-w-[100vmin] w-full p-4 bg-orange-700 border-l-[8px] border-r-[8px] border-stone-700">
        {showLeaderboard
          ? <Leaderboard /> : null
        }
        <div className={"flex flex-col items-center gap-4 " + (showLeaderboard ? "hidden" : "")}>
          {'ontouchstart' in window ? <TouchGame submitScore={((score) => submitScore('touch', score))} /> : <MouseGame submitScore={(score) => submitScore('mouse', score)} /> }
        </div>
      </div>
    </>
  )
}

export default App
