// // Profile.jsx
// import React, { useRef } from "react";
// import { Modal, Button, Form, Image } from "react-bootstrap";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useQuery, useMutation } from "@apollo/client";
// import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars } from "react-icons/fa";
// import { AUTH, UPDATE_PROFILE } from "../graphql/queries";

// const validationSchema = Yup.object({
//   username: Yup.string().required("Username is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   gender: Yup.string().required("Gender is required"),
//   phone: Yup.string().required("Phone is required"),
//   address: Yup.string().required("Address is required")
// });

// const Profile = ({ show, handleClose, onProfileUpdate, user }) => {
//     const { data, loading } = useQuery(AUTH);
//     const [updateProfile] = useMutation(UPDATE_PROFILE, {
//         update(cache, { data: { updateProfile } }) {
//           if (updateProfile?.user) {
//             cache.writeQuery({
//               query: AUTH,
//               data: { auth: updateProfile.user }
//             });
//           }
//         }
//       });
// //   const [updateProfile] = useMutation(UPDATE_PROFILE, {
// //     refetchQueries: [{ query: AUTH }],
// //     awaitRefetchQueries: true
// //   });
//   const fileInputRef = useRef();

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       username: data?.auth.username || "",
//       email: data?.auth.email || "",
//       gender: data?.auth.gender || "",
//       phone: data?.auth.phone || "",
//       address: data?.auth.address || "",
//       picture: data?.auth.picture || ""
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//         try {
//           const { data: response } = await updateProfile({ variables: { input: values } });
//           if (response?.updateProfile?.user && onProfileUpdate) {
//             onProfileUpdate(response.updateProfile.user); // 👈 Update parent
//           }
//           handleClose();
//         } catch (err) {
//           console.error(err);
//         }
//       }
//   });

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         formik.setFieldValue("picture", reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   if (loading) return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Update Profile</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div>
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="mb-3">
//               <div className="bg-secondary" style={{ height: "38px", borderRadius: "4px", opacity: 0.3 }}></div>
//             </div>
//           ))}
//         </div>
//       </Modal.Body>
//     </Modal>
//   );

//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Update Profile</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={formik.handleSubmit}>
//           <div className="text-center mb-3">
//             <Image
//               src={formik.values.picture || "https://via.placeholder.com/100"}
//               roundedCircle
//               style={{ width: 100, height: 100, objectFit: 'cover', cursor: 'pointer' }}
//               onClick={() => fileInputRef.current.click()}
//             />
//             <Form.Control
//               type="file"
//               accept="image/*"
//               style={{ display: 'none' }}
//               ref={fileInputRef}
//               onChange={handleImageChange}
//             />
//           </div>

//           <Form.Group className="mb-3">
//             <Form.Label><FaUser /> Username</Form.Label>
//             <Form.Control
//               name="username"
//               value={formik.values.username}
//               onChange={formik.handleChange}
//               isInvalid={!!formik.errors.username}
//             />
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.username}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label><FaEnvelope /> Email</Form.Label>
//             <Form.Control
//               name="email"
//               type="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               isInvalid={!!formik.errors.email}
//             />
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.email}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label><FaVenusMars /> Gender</Form.Label>
//             <Form.Select
//               name="gender"
//               value={formik.values.gender}
//               onChange={formik.handleChange}
//               isInvalid={!!formik.errors.gender}
//             >
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </Form.Select>
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.gender}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label><FaPhone /> Phone (w/ country code)</Form.Label>
//             <Form.Control
//               name="phone"
//               value={formik.values.phone}
//               onChange={formik.handleChange}
//               isInvalid={!!formik.errors.phone}
//             />
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.phone}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label><FaMapMarkerAlt /> Address</Form.Label>
//             <Form.Control
//               name="address"
//               value={formik.values.address}
//               onChange={formik.handleChange}
//               isInvalid={!!formik.errors.address}
//             />
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.address}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Button variant="primary" type="submit">
//             Save Change
//           </Button>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default Profile;

import React, { useRef } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@apollo/client";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars } from "react-icons/fa";
import { UPDATE_PROFILE, AUTH } from "../graphql/queries";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  gender: Yup.string().required("Gender is required"),
  phone: Yup.string().required("Phone is required"),
  address: Yup.string().required("Address is required"),
  birthday: Yup.string().required("Birthday is required"), // optional, or use .required(...) if needed
});

const Profile = ({ show, handleClose, onProfileUpdate, user }) => {
  const fileInputRef = useRef();

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    update(cache, { data: { updateProfile } }) {
      if (updateProfile?.user) {
        cache.writeQuery({
          query: AUTH,
          data: { auth: updateProfile.user }
        });
      }
    }
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
      gender: user?.gender || "",
      phone: user?.phone || "",
      address: user?.address || "",
      picture: user?.picture || "",
      birthday: user?.birthday || ""
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { data: response } = await updateProfile({ variables: { input: values } });
        if (response?.updateProfile?.user && onProfileUpdate) {
          onProfileUpdate(response.updateProfile.user);
        }
        handleClose();
      } catch (err) {
        console.error(err);
      }
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue("picture", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <div className="text-center mb-3">
            <Image
              src={formik.values.picture || "/avatar.png"}
              roundedCircle
              style={{ width: 100, height: 100, objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => fileInputRef.current.click()}
            />
            <Form.Control
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          <Form.Group className="mb-3">
            <Form.Label><FaUser /> Username</Form.Label>
            <Form.Control
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FaEnvelope /> Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FaVenusMars /> Gender</Form.Label>
            <Form.Select
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.gender}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.gender}
            </Form.Control.Feedback>
           </Form.Group>
                  
           <Form.Group className="mb-3">
            <Form.Label>🎂 Birthday</Form.Label>
            <Form.Control
                type="date"
                name="birthday"
                value={formik.values.birthday}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.birthday}
            />
            <Form.Control.Feedback type="invalid">
                {formik.errors.birthday}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FaPhone /> Phone (w/ country code)</Form.Label>
            <Form.Control
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.phone}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.phone}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FaMapMarkerAlt /> Address</Form.Label>
            <Form.Control
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.address}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Save Change
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Profile;
