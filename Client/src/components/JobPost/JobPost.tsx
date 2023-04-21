import React, {useState} from 'react';
import './JobPost.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PostingType, userType } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { storePosting } from '../../redux/PostingSlice';

const JobPost = () => {
  const user = useSelector((state:userType) => state.worker)
  const dispatch = useDispatch()
    const {id} = useParams();
    const navigate = useNavigate()
    
    const { isLoading, error, data} = useQuery({
      queryKey: [`jobPost`, id],
      queryFn: async ({queryKey}) => {
        const data = await fetch(`http://localhost:8080/api/v1/postings/${queryKey[1]}`)
        if(data.status === 404) {
          navigate("/browse")
        }
        return data.json()
      },
    })
    if(isLoading) return <h1>Loading...</h1>
    if(error) console.log(error);

    /* const test = {
      id: data.id,
      title: data.title,
      company: {
        id: data.company.id
      }
    }

    console.log(data) */

    const storePostingData = () => {
      dispatch(storePosting(data))
    }

  return (
    <div className="jobPostContainer">
      <div className="jobPostHeader">
        <h1 className='jobPostTitle'>{data.title}</h1>
        <p className='jobPostCompany'>{data.businessName}</p>
        <div className="jobPostDateAndCountry">
          <p className="jobPostCountry">{data.country}</p>
          <p className="jobPostDate">{data.date}</p>
        </div>
        <div className="jobPostTypeContainer">
          {data.jobType.map((type:string, i:number) => (
            <p className='jobPostType' key={i}>{type}</p>
          ))}
        </div>
        <p className='jobPostSalary'>$ {data.salary} {data.salaryCurrency} per {data.salaryRate}</p>
      </div>
      <div className="jobPostAbout">
        <section>
          <p>Descripción</p>
          <h1 className="jobPostDescription">{data.description}</h1>
        </section>
        <p className='jobPostLocation'>Ubicación: <span>{data.location}</span></p>
        <p className='jobPostDuration'>Duración: {data.duration === "Indefinite" ? <span>{data.duration}</span> : <span>{data.duration} Meses</span> }</p>
        <ul className='jobPostBenefitsContainer'>
          <h1 className='jobPostBenefitsHeader'>Beneficios</h1>
          {data.benefits.map((benefit:string, i:number) => (
            <li className='jobPostBenefit' key={i}>{benefit}</li>
          ))}
        </ul>
      </div>
      <div className="jobPostTagsContainer">
        <h1 className='jobPostTagsHeader'>Tags</h1>
        <section>
          {data.tags.map((tag:string, i:number) => (
            <p className='jobPostTag' key={i}>{tag}</p>
            ))}
        </section>
      </div>
      {user.Role === "worker" 
       ?
            <div className="jobPostApplyButton">
              <Link to="./apply" onClick={() => storePostingData()}>
                <button onClick={() => storePostingData()}>Apply</button>
              </Link>
            </div>
       :
            null
       }
    </div>
  )
}

export default JobPost