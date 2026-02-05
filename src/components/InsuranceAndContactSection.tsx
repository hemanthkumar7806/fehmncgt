import { Shield, UserPlus, MapPin, ArrowRight } from 'lucide-react';
import type { InsuranceData } from '@/types/cms';

const DEFAULT_INSURANCES = ['Aetna', 'Blue Cross', 'Cigna', 'UHC', 'Horizon', 'Oxford', 'Medicare', 'Medicaid'];
const DEFAULT_PORTAL_URL = 'https://patientportal.holyname.org/login/register/ZEtTdlB...........NRRlk%3D';
const DEFAULT_ADDRESS = { line1: '222 Cedar Ln Suite 303', city: 'Teaneck', state: 'NJ', zip: '07666', phone: '201-833-7212', directionsUrl: 'https://www.google.com/maps/place/222+Cedar+Ln+Suite+303,+Teaneck,+NJ+07666', directionsText: 'Get Directions' };

export default function InsuranceAndContactSection({ data }: { data?: InsuranceData | null }) {
  if (data?.showSection === false) return null;

  const sectionTitle = data?.sectionTitle ?? 'We Accept Most Plans';
  const insurances = (data?.insuranceProviders?.length) ? data.insuranceProviders : DEFAULT_INSURANCES;
  const portal = data?.careCompassPortal;
  const portalTitle = portal?.title ?? 'Care Compass Portal';
  const portalDesc = portal?.description ?? 'Access records, test results, and communicate with your care team';
  const portalUrl = portal?.registrationUrl ?? DEFAULT_PORTAL_URL;
  const portalBtn = portal?.buttonText ?? 'Register Now';
  const visit = data?.visitInfo;
  const visitTitle = visit?.title ?? 'Visit Us';
  const addressLine1 = visit?.addressLine1 ?? DEFAULT_ADDRESS.line1;
  const city = visit?.city ?? DEFAULT_ADDRESS.city;
  const state = visit?.state ?? DEFAULT_ADDRESS.state;
  const zip = visit?.zipCode ?? DEFAULT_ADDRESS.zip;
  const phone = visit?.phone ?? DEFAULT_ADDRESS.phone;
  const directionsUrl = visit?.directionsUrl ?? DEFAULT_ADDRESS.directionsUrl;
  const directionsText = visit?.directionsText ?? DEFAULT_ADDRESS.directionsText;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm h-full">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-secondary bg-opacity-10 p-3 rounded-lg">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
          </div>
          <h2 className="ml-4 text-2xl sm:text-3xl font-heading font-bold text-primary">
            {sectionTitle}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {insurances.map((name, index) => (
            <div key={index} className="bg-hnmc-gray rounded-lg p-3 text-center font-medium text-gray-700 hover:shadow-md transition text-sm">
              {name}
            </div>
          ))}
        </div>
      </div>
      <hr className="border-gray-200 my-8" />
      <div className="mb-8">
        <div className="flex items-start mb-4">
          <div className="bg-secondary bg-opacity-10 p-3 rounded-lg">
            <UserPlus className="w-6 h-6 text-secondary" />
          </div>
          <div className="ml-4">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-2">{portalTitle}</h3>
            <p className="text-gray-600 mb-4">{portalDesc}</p>
          </div>
        </div>
        <a href={portalUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto border-2 border-secondary text-secondary px-6 py-3 rounded hover:bg-secondary hover:text-white transition font-medium text-center">
          {portalBtn}
        </a>
      </div>
      <hr className="border-gray-200 my-8" />
      <div>
        <div className="flex items-start mb-4">
          <div className="bg-secondary bg-opacity-10 p-3 rounded-lg">
            <MapPin className="w-6 h-6 text-secondary" />
          </div>
          <div className="ml-4">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-2">{visitTitle}</h3>
            <p className="text-gray-700 mb-1">{addressLine1}</p>
            <p className="text-gray-700 mb-2">{city}, {state} {zip}</p>
            <a href={`tel:${phone}`} className="text-secondary font-medium hover:underline">{phone}</a>
          </div>
        </div>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-secondary font-medium hover:underline">
          {directionsText}
          <ArrowRight className="w-5 h-5 ml-2" />
        </a>
      </div>
    </div>
  );
}
