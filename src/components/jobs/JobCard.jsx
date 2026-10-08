import { useNavigate } from "react-router-dom";

function JobCard({ job }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2>{job.title}</h2>

      <p>
        <strong>Company:</strong>{" "}
        {job.companyName}
      </p>

      <p>
        <strong>Location:</strong>{" "}
        {job.location}
      </p>

      <p>
        <strong>Job Type:</strong>{" "}
        {job.jobType}
      </p>

      <p>
        <strong>Skills:</strong>{" "}
        {job.skills}
      </p>

      <p>
        <strong>Experience:</strong>{" "}
        {job.experienceRequired}
      </p>

      <button
        onClick={() =>
          navigate(`/student/jobs/${job.id}`)
        }
      >
        View Details
      </button>

      <hr />
    </div>
  );
}

export default JobCard;