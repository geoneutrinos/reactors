import React, { useContext } from "react";
import { Card, Form } from "react-bootstrap";

import { MathJax } from "better-react-mathjax";

import { MassOrdering } from "../physics/neutrino-oscillation";
import { PhysicsContext } from "../state";

export const NeutrinoOscillationPane = () => {
  const {oscillation, oscillationDispatch} = useContext(PhysicsContext)

    const MassOrderingInput = (
    <Form.Group controlId="neutrinoMassOrder">
      <Form.Label>Neutrino Mass Ordering- Normal or Inverted (NO or IO)</Form.Label>
      <Form.Control
        as="select"
        onChange={(event) => oscillationDispatch({arg:"massOrdering", value:event.target.value})}
        value={oscillation.massOrdering}
      >
        {Object.values(MassOrdering).map((order) => (
          <option key={order} value={order}>
            {order}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
  return (
    <Card>
      <Card.Header>Neutrino Oscillations</Card.Header>
      <Card.Body>
          {MassOrderingInput}
          <div>
            <p>
              <MathJax>{String.raw`The probability that an electron neutrino or an electron antineutrino, assuming CPT invariance, of energy 
              $E_{{\nu}_\mathrm{e}}$ in MeV changes flavor after traveling a distance
              $L$ in meters is
              $$
              \begin{split}
                P_{\mathrm{e}x}(L,E_{{\nu}_\mathrm{e}})=\cos^4\theta_{13}\sin^22\theta_{12}\sin^2(1.27\delta m^2_{21}L/E_{{\nu}_\mathrm{e}})\,\\
                +\cos^2\theta_{12}\sin^22\theta_{13}\sin^2(1.27\delta m^2_{31}L/E_{{\nu}_\mathrm{e}})\,\\
                +\sin^2\theta_{12}\sin^22\theta_{13}\sin^2(1.27\delta m^2_{32}L/E_{{\nu}_\mathrm{e}}),\\
                \end{split}
              $$
              $\delta m_{ji}^2=m_j^2-m_i^2$ is the neutrino mass-squared difference in $\text{eV}^2$ and
              $\theta_{12}$,
              $\theta_{13}$, are the solar, reactor mixing angles, respectively. The complementary probability,
              $P_\mathrm{ee}(L,E_{{\nu}_\mathrm{e}}) = 1 - P_{\mathrm{e}x}(L,E_{{\nu}_\mathrm{e}})$, gauges survival 
              of electron flavor. The Table below lists the neutrino oscillation parameter values used to estimate the spectral distortion of reactor 
              antineutrino reactions and the overall suppression of geo-neutrino reactions. An average survival probability, given by
              $$<\!\!{P}_\mathrm{ee}\!\!> = 1- \frac{1} {2} \big(\cos^4 \theta_{13} \sin^2(2\theta_{12}) + \sin^2(2\theta_{13}) \big),$$ 
              approximates the effect of oscillations on geo-neutrinos. The
              $\pm 1\sigma$ uncertainties on the average survival probability
              $(\sim \pm1.8 \%)$ conservatively estimate the errors on the calculated antineutrino reaction rates 
              introduced by the imprecise knowledge of the oscillation parameters.
              `}
              </MathJax>
            </p>
          </div>
      </Card.Body>
    </Card>
  );
};
