import { fetchToken } from '../helpers/fetch';
import { IToDo, INotes } from '../models/todo-models';

export const startLoadingNotes = () => {
    return async (dispatch: any) => {
        try {
            localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MWUwY2QzMDUwNGNmNDcwZTEyODk4ZTQiLCJpYXQiOjE2NDI2OTE2ODcsImV4cCI6MTY0Mjc3ODA4N30.uoh9cEubfzmdHaoWC6_9mYDwMZO1bsxApUdnAZ7y0U4');
            const uid = '61e0cd30504cf470e12898e4';
            const res: any  = await fetchToken(`notes/${uid}`);
            const body: any = await res.json();
            
            if (body.ok) {
                dispatch({ type: 'Load_notes', payload: body.data })
            } else {                                                    // eslint-disable-next-line no-throw-literal
                throw 'hubo un error :c';
            }
        } catch (e) {
            console.log('Error getting notes data: ', e);
        }
    }
}

// set active note
export const setActiveNote = (note: any) => ({ type: 'Set_active_note', payload: note });

// start updating note
export const startUpdatingNote = (note: any) => {
    return async(dispatch: any) => {
        try {
            localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MWUwY2QzMDUwNGNmNDcwZTEyODk4ZTQiLCJpYXQiOjE2NDI2OTA3NzIsImV4cCI6MTY0Mjc3NzE3Mn0.ovaUaFvdt59jzA0mgR8MWATvGcOkeS3Mq-6QX81xCGI');
            const res: any = await fetchToken(`notes/${ note._id }`, { ...note }, 'PUT');
            const body: any = await res.json();
            if (body['ok']) {
                dispatch({ type: 'Update_note', payload: body.data });
            } else {
                throw 'Hubo un error :c';                                // eslint-disable-line no-throw-literal
            }

        } catch (e) {
            console.log('Error getting notes data: ', e);
        }
    }
}

export const startAddingNote = (newNote: any) => {
    return async( dispatch: any) => {
        try {
            const res: any = await fetchToken(`notes`, newNote, 'POST');
            const body: any = await res.json();
            console.log('new data: ', body);
            if (body['ok']) {
                dispatch({ type: 'Add_note', payload: body.data });
            } else {
                throw 'Error adding notes'; // eslint-disable-line no-throw-literal
            }
        }
        catch ( e ) {
            console.log(e);
        }
    }
}

// add to do's of notes
export const startAddingToDo = ( todo: IToDo ) => {
    
    return async ( dispatch: any, getState: any ) => {

        const { activeNote } = getState().notes;
        const updateNote: INotes = {
            ...activeNote,
            todolist: [ ...activeNote.todolist, todo ]
        }
        
        dispatch( startUpdatingNote(updateNote) );

    }
}

// export const startAddingNotes = ( note: any, notes: any ) => {
//     return async ( dispatch: any, getState: any ) => {
//         const update = {
//             todolist: [ ...notes, note ]
//         }
//         console.log('update: ', update);
        
//     }
// }

// delete to do's of notes
export const deleteToDo = ( todoItem: any ) => {
    return async ( dispatch: any, getState: any ) => {
        
        const { activeNote } = getState().notes;
        activeNote.todolist.forEach((element: any, idx: any) => {
            if ( element._id === todoItem._id ) {
                activeNote.todolist.splice(idx, 1);
            }
        });
        const updateNote: INotes = {
            ...activeNote,
            todolist: [ ...activeNote.todolist ]
        }
        dispatch( startUpdatingNote(updateNote) );
        
    }
}

export const updateCheck = ( todoItem: any ) => {
    return async ( dispatch: any, getState: any) => {
        const { activeNote } = getState().notes;
        activeNote.todolist.forEach((element: any, idx: any) => {
            if ( element._id === todoItem._id ) {
                console.log('change check from: ', element);
                activeNote.todolist[idx].done = !element.done;
            }
        });
        const updateNote: INotes = {
            ...activeNote,
            todolist: [ ...activeNote.todolist ]
        }
        dispatch( startUpdatingNote(updateNote) );
    }
}
