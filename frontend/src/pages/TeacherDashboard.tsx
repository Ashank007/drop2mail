import { useState } from "react";
import TabsLayout from "../components/TabsLayout";
import TeacherCollectionTab from "../components/tabs/TeachersCollectionTab";
import TeacherStudentsTab from "../components/tabs/TeachersStudentTab";
import EmailTab from "../components/tabs/EmailTab";

// ✅ Type definitions
interface Student {
  id: string;
  name: string;
  email: string;
}

interface Collection {
  id: string;
  name: string;
  students: Student[];
}

interface TabItem {
  id: string;
  label: string;
  component: JSX.Element;
}

export default function TeacherDashboard() {
  // Centralized states (sirf Teacher ke liye)
  const [students, setStudents] = useState<Student[]>([]);
  const [collections, setCollections] = useState<Collection[]>([
    { id: "c1", name: "Group A", students: [] },
    { id: "c2", name: "Group B", students: [] },
  ]);

  const tabs: TabItem[] = [
    {
      id: "students",
      label: "Students",
      component: <TeacherStudentsTab />,
    },
    {
      id: "collections",
      label: "Collections",
      component: (
        <TeacherCollectionTab
          students={students}
          collections={collections}
          setCollections={setCollections}
        />
      ),
    },
    {
      id: "email",
      label: "Email",
      component: <EmailTab students={students} collections={collections} />,
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      <TabsLayout tabs={tabs} />
    </div>
  );
}


