const chaikin = (function() {
    // linear interpolation, return a point(t) between start and end
    function _lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    // returned 2 points "sliced" between original 2 points
    function _chaikinCut(a, b, ratio) {
        return [
            { x: _lerp(a.x, b.x, ratio), y: _lerp(a.y, b.y, ratio) },
            { x: _lerp(b.x, a.x, ratio), y: _lerp(b.y, a.y, ratio) }
        ];
    }

    return function(shape, ratio, iterations, close) {
        // no more iterations left, return the result
        if (iterations === 0) return shape;

        // next shape iteration
        const next = [];
        // corner = each vertex ({x, y}) in shape
        const corners = Object.keys(shape);
        const numCorners = close ? corners.length : corners.length - 1;

        for (let i = 0; i < numCorners; i++) {
            // side + adjacent side
            const a = shape[corners[i]];
            const b = shape[corners[(i + 1) % corners.length]];
            // "cut" points between each side
            const n = _chaikinCut(a, b, ratio);

            if (!close && i === 0) {
                // ignore the "cut" A vertex for start point of open shapes
                next.push({ x: a.x, y: a.y });
                next.push({ x: n[1].x, y: n[1].y });
            } else if (!close && i === numCorners - 1) {
                // ignore the "cut" B vertex for end point of open shapes
                next.push({ x: n[0].x, y: n[0].y });
                next.push({ x: b.x, y: b.y });
            } else {
                // add both cut vertices
                next.push({ x: n[0].x, y: n[0].y });
                next.push({ x: n[1].x, y: n[1].y });
            }
        }

        return chaikin(next, ratio, iterations - 1, close);
    };
})();
