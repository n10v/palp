package bbpool

import (
	"bytes"
	"sync"
)

var bbPool = sync.Pool{New: func() interface{} { return new(bytes.Buffer) }}

func Get() *bytes.Buffer {
	return bbPool.Get().(*bytes.Buffer)
}

func Put(buf *bytes.Buffer) {
	buf.Reset()
	bbPool.Put(buf)
}
