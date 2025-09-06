import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiUsers, FiFolderPlus, FiMove } from "react-icons/fi";

// Demo students
const demoStudents = [
  { _id: "1", name: "Aarav Sharma", email: "aarav.sharma@example.com" },
  { _id: "2", name: "Isha Singh", email: "isha.singh@example.com" },
  { _id: "3", name: "Rohan Mehra", email: "rohan.mehra@example.com" },
  { _id: "4", name: "Diya Gupta", email: "diya.gupta@example.com" },
];

// Demo collections
const demoCollections = [
  { id: "c1", name: "Group A", students: [] },
  { id: "c2", name: "Group B", students: [] },
];

const CollectionList = () => {
  const [students, setStudents] = useState([...demoStudents]);
  const [collections, setCollections] = useState([...demoCollections]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Dropped in same list → reorder
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "students") {
        const items = Array.from(students);
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);
        setStudents(items);
      } else {
        const colIndex = collections.findIndex(
          (c) => c.id === source.droppableId
        );
        const col = { ...collections[colIndex] };
        const items = Array.from(col.students);
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);
        const newCollections = [...collections];
        newCollections[colIndex] = { ...col, students: items };
        setCollections(newCollections);
      }
    } else {
      // Moving between different lists
      if (source.droppableId === "students") {
        const items = Array.from(students);
        const [moved] = items.splice(source.index, 1);
        const destIndex = collections.findIndex(
          (c) => c.id === destination.droppableId
        );
        const newCollections = [...collections];
        newCollections[destIndex].students.splice(destination.index, 0, moved);
        setStudents(items);
        setCollections(newCollections);
      } else if (destination.droppableId === "students") {
        const colIndex = collections.findIndex(
          (c) => c.id === source.droppableId
        );
        const col = { ...collections[colIndex] };
        const items = Array.from(col.students);
        const [moved] = items.splice(source.index, 1);
        const newCollections = [...collections];
        newCollections[colIndex] = { ...col, students: items };
        const newStudents = [...students];
        newStudents.splice(destination.index, 0, moved);
        setCollections(newCollections);
        setStudents(newStudents);
      } else {
        // Between collections
        const srcIndex = collections.findIndex(
          (c) => c.id === source.droppableId
        );
        const destIndex = collections.findIndex(
          (c) => c.id === destination.droppableId
        );
        const srcCol = { ...collections[srcIndex] };
        const destCol = { ...collections[destIndex] };

        const srcItems = Array.from(srcCol.students);
        const [moved] = srcItems.splice(source.index, 1);
        const destItems = Array.from(destCol.students);
        destItems.splice(destination.index, 0, moved);

        const newCollections = [...collections];
        newCollections[srcIndex] = { ...srcCol, students: srcItems };
        newCollections[destIndex] = { ...destCol, students: destItems };
        setCollections(newCollections);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-600 to-purple-500 text-white p-6 flex flex-col shadow-lg">
        <h2 className="text-2xl font-bold mb-12 flex items-center gap-2">
          <FiFolderPlus /> Collections
        </h2>
        <nav className="flex flex-col gap-3 text-lg">
          <button className="flex items-center gap-3 p-3 rounded-lg bg-purple-700 font-semibold shadow-inner">
            <FiUsers size={20} /> Manage Collections
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Collections</h1>
        <p className="text-gray-500 mb-8">
          Drag students from the list and drop them into collections.
        </p>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student Pool */}
            <Droppable droppableId="students">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white rounded-2xl shadow-md p-6 border min-h-[500px] transition ${
                    snapshot.isDraggingOver
                      ? "shadow-xl ring-2 ring-purple-400"
                      : ""
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-5 text-gray-700">
                    All Students
                  </h2>
                  {students.map((s, index) => (
                    <Draggable
                      key={s._id}
                      draggableId={s._id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 mb-3 rounded-xl shadow-sm cursor-grab transition ${
                            snapshot.isDragging
                              ? "bg-purple-100 shadow-lg scale-105"
                              : "bg-white hover:bg-gray-100"
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
              )}
            </Droppable>

            {/* Collections */}
            {collections.map((col) => (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white rounded-2xl shadow-md p-6 border min-h-[500px] flex flex-col transition ${
                      snapshot.isDraggingOver
                        ? "shadow-xl ring-2 ring-green-400"
                        : ""
                    }`}
                  >
                    <h2 className="text-xl font-semibold mb-5 text-green-800">
                      {col.name}
                    </h2>
                    <div className="flex-1">
                      {col.students.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <FiMove size={40} className="mb-2" />
                          <p>No students yet</p>
                        </div>
                      )}
                      {col.students.map((s, index) => (
                        <Draggable
                          key={s._id}
                          draggableId={s._id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 mb-3 rounded-xl shadow-sm cursor-grab transition ${
                                snapshot.isDragging
                                  ? "bg-green-200 shadow-lg scale-105"
                                  : "bg-green-100 hover:bg-green-200"
                              }`}
                            >
                              <p className="font-medium text-gray-800">
                                {s.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {s.email}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
};

export default CollectionList;


