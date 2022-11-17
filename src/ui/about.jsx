import { Card } from "react-bootstrap";

export const AboutPane = () => {
  return (
    <Card>
      <Card.Header>Antineutrino Model</Card.Header>
      <Card.Body>
        <div>
          <p> RESOURCE: The antinutrino model presented by this website is further documented in this somewhat outdated paper{" "}
            <a href="https://arxiv.org/pdf/1510.05633.pdf">arXiv:1510.05633.v3</a>
          </p>
          <p>
            REFERENCE: Please cite this website when using the results of this model in research papers and/or presentations:
            <br />
            A.M. Barna and S.T. Dye (est. 2010). <i>Antineutrino Model</i> https://reactors.geoneutrinos.org. Accessed DAY MONTH YEAR
          </p>
          <p> ACKNOWLEDGEMENT: Development of the model and this web application has been supported through the years in part by:
            <br />
            • NSF EAR Division of Earth Sciences (Award{"#"} 0855838)
            <br />
            • Lawrence Livermore National Security, LLC 
            (Research Subcontract No.s B602732, B612361, B618031, B621682, B628127, B636606, B639958, B644724, B651218)
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};
