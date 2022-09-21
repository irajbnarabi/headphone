package ir.headphone.videos.error;

import ir.headphone.spi.error.NotFound;

public class ProgramNotFound extends NotFound {
    public ProgramNotFound(String programId) {
        super("program is not found. id: " + programId);
    }
}
