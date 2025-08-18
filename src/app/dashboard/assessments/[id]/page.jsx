// app/dashboard/assessments/[id]/page.jsx

import React from 'react';

const AssessmentPage = ({ params }) => {
  const { id } = params;

  return (
    <div>
      <h1>Assessment ID: {id}</h1>
      {/* Your other components here */}
    </div>
  );
};

export default AssessmentPage;
