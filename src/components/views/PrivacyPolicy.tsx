import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Textarea } from "@nextui-org/react";
import BackButton from "../ui/BackButton";
import PolicyContainer from "../ui/PolicyContainer";


const PrivacyPolicy = () => {
  const navigate = useNavigate();

  // Function to handle back navigation
  const goBack = () => {
    navigate("/landing");
  };

  return (

    <div className="w-full h-full flex flex-col">
      <div className="absolute top-4 left-4 z-50">
        <BackButton />
      </div>

        <div className="flex items-center h-full flex-col mt-10 mr-40 ml-40 mb-10">
          <h1 className="text-3xl font-bold text-gray-700 my-0 text-center mb-6">
            Privacy Policy of peekseek.ch
          </h1>
          <PolicyContainer size="policy" className="flex-grow overflow-y-auto flex flex-col items-center max-w-full mt-2 mb-2">
            <p className="text-medium text-gray-700 my-0 mb-2">
              peekseek.ch operates the peekseek.ch website, which provides the SERVICE.</p>

            <p className="text-medium text-gray-700 my-0 mb-2">This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the PeekSeek website.</p>

            <p className="text-medium text-gray-700 my-0 mb-2">If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p>

            <p className="text-medium text-gray-700 my-0 mb-2">The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at peekseek.ch, unless otherwise defined in this Privacy Policy.</p>

            <h2 className="text-medium font-bold text-gray-700 my-0 mb-2">Information Collection and Use</h2>

            <p className="text-medium text-gray-700 my-0 mb-2">For a better experience while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.</p>

            <h2 className="text-medium font-bold text-gray-700 my-0 mb-2">Log Data</h2>

            <p className="text-medium text-gray-700 my-0 mb-2">We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer&apos;s Internet Protocol (&quot;IP&quot;) address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.</p>

            <h2 className="text-medium font-bold text-gray-700 my-0 mb-2">Cookies</h2>

            <p className="text-medium text-gray-700 my-0 mb-2">Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer&apos;s hard drive.</p>

            <p className="text-medium text-gray-700 my-0 mb-2">Our website uses these &quot;cookies&quot; to collection information and to improve our Service. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Service.</p>

            <h2 className="text-medium font-bold text-gray-700 my-0 mb-2">Service Providers</h2>

            <p className="text-medium text-gray-700 my-0 mb-2">We may employ third-party companies and individuals due to the following reasons:</p>

            <ul className="text-medium text-gray-700 my-0 mb-2">
              <li className="text-medium text-gray-700 my-0 mb-2">To facilitate our Service;</li>
              <li className="text-medium text-gray-700 my-0 mb-2">To provide the Service on our behalf;</li>
              <li className="text-medium text-gray-700 my-0 mb-2">To perform Service-related services; or</li>
              <li className="text-medium text-gray-700 my-0 mb-2">To assist us in analyzing how our Service is used.</li>
            </ul>

            <p className="text-medium text-gray-700 my-0 mb-2">We want to inform our Service users that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</p>

            <h2 className="text-medium font-bold text-gray-700 my-0 mb-2">Security</h2>

            <p className="text-medium text-gray-700 my-0 mb-2">We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>

            <h2 className="text-medium font-bold text-gray-700 my-0 mb-2">Links to Other Sites</h2>

            <p className="text-medium text-gray-700 my-0 mb-2">Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>

            <h2 className="text-medium font-bold text-gray-700 my-0 mb-2">Children&apos;s Privacy</h2>

            <p className="text-medium text-gray-700 my-0 mb-2">Our Services do not address anyone under the age of 13. We do not knowingly collect personal identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.</p>

            <h2 className="text-medium font-bold text-gray-700 my-0 mb-2">Changes to This Privacy Policy</h2>

            <p className="text-medium text-gray-700 my-0 mb-2">We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.</p>

            <p className="text-medium text-gray-700 my-0 mb-2">Our Privacy Policy was created with the help of the <a href="https://www.privacypolicytemplate.net">Privacy Policy Template</a>.</p>
          </PolicyContainer>
        </div>


      <div className="flex items-center h-full flex-col  mb-10 mt-auto">
        <Button
          color="primary"
          onClick={goBack}
          radius = "full"
        >
          Back
        </Button>

        </div>
    </div>


  );
};

export default PrivacyPolicy;