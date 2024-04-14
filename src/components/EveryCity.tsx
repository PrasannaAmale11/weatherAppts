import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';



const EveryCity: React.FC = () => {
  const [cities, setCities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchCities();
  }, [currentPage, searchTerm]);

  const fetchCities = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://public.opendatasoft.com/api/records/1.0/search/?rows=40&start=${(currentPage - 1) * 40}&disjunctive.cou_name_en=truee_en,ascii_name,alternate_names,population,dem,timezone,country_code,coordinates&dataset=geonames-all-cities-with-a-population-1000&timezone=Asia%2FKolkata&lang=en&q=${searchTerm}`
      );
      
  
      if (currentPage === 1 || searchTerm.trim() !== '') {
        setCities(response.data.records);
      } else {
      
        setCities(prevCities => [...prevCities, ...response.data.records]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrolledToBottom = scrollTop + windowHeight >= documentHeight;

   
    if (scrolledToBottom && !isLoading) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className='wrapperTable h-auto  flex flex-col py-4 overflow-hidden justify-center items-center'>
      <input
        type="text"
        placeholder="Search City"
        value={searchTerm}
        onChange={handleSearchChange}
        className=' outline-none rounded-lg'
        style={{ marginBottom: '16px', padding: '8px', width: '50%' }}
      />
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>City Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Country</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Timezone</th>
          </tr>
        </thead>
        <tbody>
          {cities.map(city => (
            <tr key={city.recordid}>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <Link
                  to= {
                     `/weather/${city.fields.ascii_name}`
                }
                    state = {{
                      latitude: city.fields.coordinates[1],
                      longitude: city.fields.coordinates[0],
                    }}
                  
                >
                  {city.fields.ascii_name}
                </Link>
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{city.fields.cou_name_en}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{city.fields.timezone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EveryCity;
