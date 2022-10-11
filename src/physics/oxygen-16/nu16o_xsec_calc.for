c code calculates the exponent
c explam = 1/4, enrg_g1 is the excitation energy E_x for group 1,
c apar_g1, bpar_g1, cpar_g1 are the a,b,c parameters for group 1
c ibins = 10000, emax = 100 MeV, such that neutrino energies
c enu(i) match the SN energies
      n1=0
      n2=0
      n3=0
      n4=0
      dele=emax/dble(ibins)
      do i=1,ibins
         enu(i)=dble(i)*dele-dele/2.d0
c initialize the exponent to give vanishing cross section
         xsec_g1(i)=-99.d0
         xsec_g2(i)=-99.d0
         xsec_g3(i)=-99.d0
         xsec_g4(i)=-99.d0
c group 1
c checks if neutrino 
         if(enu(i).gt.enrg_g1)then
c mark the index of the first one above excitation energy
            if(n1.eq.0) i1=i
c Eq. 4b
            lamda_g1=enu(i)**explam-enrg_g1**explam
            lamda_g1=dlog10(lamda_g1)
c Eq. 4a
            xsec_g1(i)=apar_g1+bpar_g1*lamda_g1+
     +cpar_g1*lamda_g1**2.d0
            n1=n1+1
c check that the new exponent is greater than the previous
c fits are a bit screwy when E_nu ~ E_x
            if(n1.gt.1)then
               if(xsec_g1(i).lt.xsec_g1(i-1))then
                  xsec_g1(i-1)=-99.d0
               end if
               if(n1.eq.2) xsec_g1(i1)=-99.d0
            end if
         end if
c code for groups 2,3,4 just repeats above
      end do

c writes the cross section file
      do k=1,ibins
         write(41,*) enu(k),10.d0**xsec_g1(k)
