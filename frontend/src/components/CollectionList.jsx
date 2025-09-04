import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Modal from "./Modal";

const demoStudents = [
  { _id: "1", name: "Aarav Sharma", email: "aarav.sharma@example.com" },
  { _id: "2", name: "Isha Singh", email: "isha.singh@example.com" },
  { _id: "3", name: "Rohan Mehra", email: "rohan.mehra@example.com" },
  { _id: "4", name: "Diya Gupta", email: "diya.gupta@example.com" },
];

const CollectionList = () => {
  const [students, setStudents] = useState([...demoStudents]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const list = source.droppableId === "students" ? students : selectedStudents;
      const setList = source.droppableId === "students" ? setStudents : setSelectedStudents;
      const items = Array.from(list);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setList(items);
    } else {
      const sourceList = source.droppableId === "students" ? students : selectedStudents;
      const destList = destination.droppableId === "students" ? students : selectedStudents;
      const newSourceItems = Array.from(sourceList);
      const newDestItems = Array.from(destList);
      const [movedItem] = newSourceItems.splice(source.index, 1);
      newDestItems.splice(destination.index, 0, movedItem);

      if (source.droppableId === "students") {
        setStudents(newSourceItems);
        setSelectedStudents(newDestItems);
      } else {
        setSelectedStudents(newSourceItems);
        setStudents(newDestItems);
      }
    }
  };

  const sendEmail = (subject, message) => {
    console.log("Sending email to:", selectedStudents, "Subject:", subject, "Message:", message);
    alert("Demo: Email sent successfully!");
    setStudents([...demoStudents]);
    setSelectedStudents([]);
    setShowModal(false);
  };

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Student Email List</h1>
        <p className="text-gray-500 mb-8">
          Drag students from the available list to the selected list to send them an email.
        </p>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Students */}
            <Droppable droppableId="students">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white rounded-2xl shadow-md p-6 border border-gray-200 min-h-[500px] transition-all duration-300 ease-in-out ${
                    snapshot.isDraggingOver ? "shadow-xl ring-2 ring-blue-400" : ""
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-5 text-gray-700">Available Students</h2>
                  <div className="flex flex-col gap-3">
                    {students.map((s, index) => (
                      <Draggable key={s._id} draggableId={s._id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-xl shadow-sm cursor-grab transition-all duration-300 ease-in-out ${
                              snapshot.isDragging
                                ? "bg-blue-100 shadow-lg scale-105"
                                : "bg-white hover:bg-gray-100 hover:shadow-md hover:scale-[1.02]"
                            }`}
                          >
                            <p className="font-medium text-gray-800">{s.name}</p>
                            <p className="text-sm text-gray-500">{s.email}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>

            {/* Selected Students */}
            <Droppable droppableId="selected">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white rounded-2xl shadow-md p-6 border border-gray-200 min-h-[500px] flex flex-col transition-all duration-300 ease-in-out ${
                    snapshot.isDraggingOver ? "shadow-xl ring-2 ring-green-400" : ""
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-5 text-green-800">Selected for Email</h2>
                  <div className="flex-1 flex flex-col gap-3">
                    {selectedStudents.length === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-4">
                        Drag & Drop Students Here
                      </div>
                    )}
                    {selectedStudents.map((s, index) => (
                      <Draggable key={s._id} draggableId={s._id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-xl shadow-sm cursor-grab transition-all duration-300 ease-in-out ${
                              snapshot.isDragging
                                ? "bg-green-200 shadow-lg scale-105"
                                : "bg-green-100 hover:bg-green-200/70 hover:shadow-md hover:scale-[1.02]"
                            }`}
                          >
                            <p className="font-medium text-gray-800">{s.name}</p>
                            <p className="text-sm text-gray-600">{s.email}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                  {selectedStudents.length > 0 && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-6 w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-[1.03] shadow-lg hover:shadow-xl"
                    >
                      Send Email to {selectedStudents.length} Student(s)
                    </button>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>

        {/* Modal */}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSend={sendEmail}
          selectedCount={selectedStudents.length}
        />
      </main>
    </div>
  );
};

export default CollectionList;


