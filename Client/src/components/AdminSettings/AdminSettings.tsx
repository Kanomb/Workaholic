import React, {useEffect, useState} from 'react';
import './AdminSettings.css';
import { CgAdd } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useSelector } from 'react-redux';
import { CountryType, userType } from '../../types';
import { AnimatePresence, motion } from 'framer-motion';

const AdminSettings = () => {
    const [AdminCreate, setAdminCreate] = useState(false)
    const [ListOfCountries, setListOfCountries] = useState<CountryType[]>([])
    const [Country, setCountry] = useState("")
    const navigate = useNavigate();
    const cookies = new Cookies();
    const User = useSelector((state:userType) => state.user)

    useEffect(() => {
      if (cookies.get("Logged") === "false" || !User.logged || User.role.name !== "admin") {
        navigate("/home");
      }
    }, [])
    

    const getCountries = async() => {
      const get = await fetch("http://localhost:8080/api/v1/country")
      const json = await get.json()
      setListOfCountries(json)
    }

  return (
    <div className="adminContainer">
      <AnimatePresence>
        {AdminCreate 
        ? 
        <motion.div 
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        exit={{opacity: 0}}
        className="createAdminContainer">
          <section>
            <h1>Name</h1>
            <input type="text" />
          </section>
          <section>
            <h1>Email</h1>
            <input type="text" />
          </section>
          <section>
            <h1>Password</h1>
            <input type="text" />
          </section>
          <section id='countrySection'>
            <h1>Country</h1>
            <input  
            value={Country}
            onClick={() => getCountries()}
            type="text"
            />
            {ListOfCountries.length > 0 
            ? 
              <article>
                {ListOfCountries.map((country) => (
                  <h1 
                  key={country.id}
                  onClick={() => setCountry(country.name)}>{country.name}</h1>
                ))}
              </article>
            :
                  null
            }
          </section>
            <div className="createAdminButtons">
              <button>Send</button>
              <button onClick={() => setAdminCreate(false)}>Close</button>
            </div>
          </motion.div>
        :
        null
      }
    </AnimatePresence>
        <div className="adminContent">
            <h1>Admin Dashboard</h1>
            <button id='addAdmin' onClick={() => setAdminCreate(true)}><CgAdd className='addIcon'/> Create admin</button>
            <div className="adminButtons">
                <button id='postings' onClick={() => navigate('./posts')}>Postings</button>
                <button id='user' onClick={() => navigate('./users')}>User</button>
                <button id='jobApp' onClick={() => navigate('./jobApp')}>Job Applications</button>
            </div>
        </div>
    </div>
  )
}

export default AdminSettings