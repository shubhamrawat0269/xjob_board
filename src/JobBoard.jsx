import { useEffect } from "react";
import "./JobBoard.css";
import { useState } from "react";
// https://hacker-news.firebaseio.com/v0/jobstories.json
// https://hacker-news.firebaseio.com/v0/item/{id}.json
const endpoint = `https://hacker-news.firebaseio.com/v0`;

function JobBoard() {
  //1. data fetch whole using fetch method
  //2. slice data to 0-6
  //3.  clicking on load more btn will append jobs 6 more...
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(6);

  const fetchJobs = async () => {
    let jobIds = await fetch(`${endpoint}/jobstories.json`);
    let jobIdsInJSON = await jobIds.json();
    // console.log(jobIdsInJSON);

    let jobIdsList = jobIdsInJSON;

    // using promise combinator --> Promise.all

    const jobList = await Promise.all(
      jobIdsList.map((jobId) =>
        fetch(`${endpoint}/item/${jobId}.json`)
          .then((res) => res.json())
          .catch((er) => console.log(er))
      )
    );

    setData(jobList);
  };

  const handleMoreJobs = () => {
    setLimit((prev) => prev + 6);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="main__div">
      <h1 style={{ textAlign: "center", margin: "1rem 0" }}>
        Job Board Bulletin
      </h1>
      <div className="job__board__section">
        {data.slice(0, limit).map((job) => {
          return (
            <div key={job.id} className="job__container">
              <h3>{job.title}</h3>
              <div className="job__info">
                <span>by {job.by}</span>
                <span>{new Date(job.time).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="btns">
        <button
          className={data.length == limit ? "btn_invisible" : ""}
          onClick={handleMoreJobs}
        >
          Load Jobs
        </button>
      </div>
    </div>
  );
}

export default JobBoard;
