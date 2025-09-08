import { useState } from "react";
import TabsLayout from "../components/TabsLayout";
import StudentsTab from "../components/tabs/StudentsTab";
import CollectionsTab from "../components/tabs/CollectionsTab";
import EmailTab from "../components/tabs/EmailTab";

export default function TeacherDashboard() {
  // Centralized states (sirf Teacher ke liye)
  const [students, setStudents] = useState([]);
  const [collections, setCollections] = useState([
    { id: "c1", name: "Group A", students: [] },
    { id: "c2", name: "Group B", students: [] },
  ]);

  const tabs = [
    {
      id: "students",
      label: "Students",
      component: (
        <StudentsTab
          students={students}
          setStudents={setStudents}
          collections={collections}
          setCollections={setCollections}
        />
      ),
    },
    {
      id: "collections",
      label: "Collections",
      component: (
        <CollectionsTab
          students={students}
          collections={collections}
          setCollections={setCollections}
        />
      ),
    },
    {
      id: "email",
      label: "Email",
      component: (
        <EmailTab students={students} collections={collections} />
      ),
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      <TabsLayout tabs={tabs} />
    </div>
  );
}


