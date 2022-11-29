import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import axios from 'axios'

const Chat = () => {
  const [socketio, setSocketIo] = useState(null)
  const [listchat, setListchat] = useState([])
  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL);
    socket.on("send-message-response", (response) => {
      // set receiver
      const receiver = JSON.parse(localStorage.getItem('receiver'))
      // Kondisi nampilkan data receiver
      if (
        (receiver.username === response[0].sender) ||
        (receiver.username === response[0].receiver)
      ) {
        setListchat(response)
      }
    })
    setSocketIo(socket)
  }, []);


  const [message, setMessage] = useState()
  const onSubmitMessage = (e) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('user'))
    const receiver = JSON.parse(localStorage.getItem('receiver'))

    // list history saat submit message
    const payload = {
      sender: user.data.username,
      receiver: receiver.username,
      message,
    }

    setListchat([...listchat, payload])

    console.log(setListchat([...listchat, payload]))

    const data = {
      sender: user.data.id,
      receiver: activeReceiver.id,
      message,
    }

    socketio.emit('send-message', data);

    setMessage('')
  }

  const [listuser, setListUser] = useState([])
  const [login, setLogin] = useState({})
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    setLogin(user)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`)
      .then((response) => {
        setListUser(response.data.data.rows)
      }).catch((error) => {
        console.log(error)
      })
  }, [])

  const [activeReceiver, setActiveReceiver] = useState({})
  const selectReceiver = (item) => {
    //TAMBAHAN MERESET CHAT
    setListchat([])

    setActiveReceiver(item)

    // set RECEIVER
    localStorage.setItem('receiver', JSON.stringify(item));
    socketio.emit('join-room', login.data)

    const data = {
      sender: login.data.id,
      receiver: item.id
    }

    socketio.emit('chat-history', data)
  }


  return (
    <>

      <h1>Halaman Chat {login.data && login.data.username} </h1>


      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ display: 'flex', width: '80%' }}>
          <div style={{ width: '20%', marginRight: '10px' }}>
            {
              listuser.map((item, index) => (
                item.id !== login.id ? (
                  <div key={index}>
                    <button onClick={() => selectReceiver(item)} style={{ border: 'none', width: '100%', height: '30px', marginBottom: '4px' }} type="button">
                      {
                        item.username
                      }
                    </button>
                  </div>
                ) : null
              ))
            }
          </div>
          <div style={{ width: '80%', height: '400px', overflow: 'scroll', border: '1px solid #ccc' }}>
            <div style={{ backgroundColor: 'blue', color: 'white' }}>
              {activeReceiver.username}
            </div>
            {
              listchat.map((item, index) => (
                <div key={index}>
                  {
                    item.sender == login.data.username ? (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}>
                        <div style={{
                          padding: '10px',
                          backgroundColor: 'blue',
                          color: 'white'
                        }}>
                          {item.message}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start'
                      }}>
                        {item.message}
                      </div>
                    )
                  }
                </div>
              ))
            }
          </div>
        </div>
        <div>
          <form onSubmit={onSubmitMessage}>
            <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} style={{ width: '400px', height: '40px' }} />
            <button style={{ height: '40px', width: '100px' }} type="submit">Send</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Chat