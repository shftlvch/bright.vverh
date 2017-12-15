/**
 * Created by x on 08.12.17.
 */
import Entry from '../models/entry';

export const index = (req, res, next) => {
    // Find all movies and return json response
    Entry.find().lean().exec((err, entries) => res.json(
        // Iterate through each movie
        { movies: entries.map(entry => ({
            ...entry,
        }))}
    ));
};