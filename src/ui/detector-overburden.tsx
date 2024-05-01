import React, {memo} from 'react';

import { Card, Table } from 'react-bootstrap';

export const DetectorOverburdens = memo(() => {
  return (
    <Card>
      <Card.Header>Detector Sites</Card.Header>
      <Card.Body>
        <Table>
            <thead>
              <tr>
                <th></th>
                <th>Muon flux (m<sup>-2</sup>s<sup>-1</sup>)</th>
                <th>Depth 1𝜎 (km.w.e.)</th>
                <th>Neutron flux 1𝜎 (m<sup>-2</sup>s<sup>-1</sup>)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>WIPP<sup>1</sup></td>
                <td>
                  (4.77±0.09)e-3
                </td>
                <td>
                  1.582-1.597
                </td>
                <td>
                  (3.36-3.46)e-4
                </td>
              </tr>
              <tr>
                <td>Canfranc<sup>2</sup></td>
                <td>
                  (4.29±0.17)e-3
                </td>
                <td>
                  1.616-1.647
                </td>
                <td>
                  (3.08-3.25)e-4
                </td>
              </tr>
              <tr>
                <td>Boulby<sup>3</sup></td>
                <td>
                  (4.09±0.15)e-4
                </td>
                <td>
                  2.783-2.829
                </td>
                <td>
                  (4.53-4.86)e-5
                </td>
              </tr>
              <tr>
                <td>LNGS<sup>4</sup></td>
                <td>
                  (3.35±0.03)e-4
                </td>
                <td>
                  2.925-2.936
                </td>
                <td>
                  (3.86-3.92)e-5
                </td>
              </tr>
              <tr>
                <td>Pyhäsalmi<sup>5</sup></td>
                <td>
                  (1.1±0.1)e-4
                </td>
                <td>
                  3.608-3.732
                </td>
                <td>
                  (1.20-1.43)e-5
                </td>
              </tr>
              <tr>
                <td>SURF<sup>6</sup></td>
                <td>
                  (5.31±0.17)e-5
                </td>
                <td>
                  4.147-4.191
                </td>
                <td>
                  (6.28-6.68)e-6
                </td>
              </tr>
              <tr>
                <td>CJPL<sup>7</sup></td>
                <td>
                  (3.53±0.23)e-6
                </td>
                <td>
                  6.012-6.104
                </td>
                <td>
                  (4.66-5.27)e-7
                </td>
              </tr>
              <tr>
                <td>SNOLab<sup>8</sup></td>
                <td>
                  (3.31±0.09)e-6
                </td>
                <td>
                  6.083-6.120
                </td>
                <td>
                  (4.56-4.79)e-7
                </td>
              </tr>
          </tbody>
          </Table>
        <p><small>
          • Measured total muon flux at detector site as referenced; Calculated equivalent flat overburden 
          and neutron flux after Mei and Hime (2006) Phys. Rev. D73, 053004; arXiv:astro-ph/0512125<br />
          1. E.-I Esch <i>et al.</i> (2005) NIM A538, 516; arXiv:astro-ph/0408486<br />
          2. W.H. Trzaska <i>et al.</i> (2019) Eur. Phys. J. C79, 721; arXiv:1902.00868<br />
          3. M. Robinson <i>et al.</i> (2003) NIM A511, 347; arXiv:hep-ex/0306014<br />
          4. N.Y. Agafonova <i>et al.</i> (2019) Phys. Rev. D100, 062002; arXiv:1909.04579<br />
          5. T. Enqvist <i>et al.</i> (2005) NIM A554, 286; arXiv:hep-ex/0506032<br />
          6. N. Abgrall <i>et al.</i> (2017) Astropart. Phys. 93, 70; arXiv:1602.07742<br />
          7. Z. Guo <i>et al.</i> (2021) Chin. Phys. C45, 025001; arXiv:2007.15925<br />
          8. B. Aharmin <i>et al.</i> (2009) Phys. Rev. D80, 012001; arXiv:0902.2776<br />
        </small></p>
      </Card.Body>
    </Card>
  );
})
