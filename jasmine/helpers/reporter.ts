import {SpecReporter, StacktraceOption} from 'jasmine-spec-reporter';

jasmine.getEnv().clearReporters(); // Supprime le reporter par défaut
jasmine.getEnv().addReporter(new SpecReporter({
    spec: {
        displayStacktrace: StacktraceOption.PRETTY // ou 'summary', 'raw', 'none' selon vos préférences
    }
}));
