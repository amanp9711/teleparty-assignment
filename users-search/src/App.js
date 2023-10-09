import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {

  const [searchQuery, setSearchQuery] = useState('');
  const [errorOccurred, setError] = useState(false);
  const [data, setData] = useState([]);
  const token = "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"; // add your github personal token to access the users search API
  let delayTimeout = useRef(null);;
  useEffect(() => {
    const getData = () => {
      const headers = {
        Authorization: `token ${token}`,
      };
      if (!searchQuery.trim()) {
        setData([]);
        return;
      }
      fetch(`https://api.github.com/search/users?q=${searchQuery}&sort=followers&order=desc`, { headers })
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData.items);
          setData(JSON.parse(JSON.stringify(responseData.items)));
        })
        .catch((error) => {
          setData([]);
          setError(true);
          console.error('Error fetching data:', error);
        });
    }
    clearTimeout(delayTimeout.current);
    delayTimeout.current = setTimeout(getData, 300);
  }, [searchQuery])

  const onSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by Name"
        value={searchQuery}
        onChange={onSearchChange}
        className="search-bar"
        style={{ marginBottom: '10px' }}
      />
      <table>
        <thead>
          <tr>
            <th>User Id</th>
            <th>Avatar</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 && data.map((item, index) => (
            <tr key={index}>
              <td>{item.login}</td>
              <td><img
                src={item.avatar_url}
                alt={`Avatar for ${item.login}`}
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
              />
              </td>
            </tr>
          ))}
          {!data.length && !errorOccurred &&
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>
                No data found.
              </td>
            </tr>}
          {!data.length && errorOccurred &&
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>
                Some error occurred.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
