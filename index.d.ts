// Type definitions for circledisc 0.0.9
// Project: https://github.com/ClarityMoe/CircleDisc
// Definitions by: Noud Kerver <https://github.com/noud02>

/// <reference types="node"/>

import { EventEmitter } from "events";
import * as http from "http";

export = CircleDisc;

declare class CircleDisc extends EventEmitter {
    public id: string;
    public token: string;
    public server: http.Server;
    public constructor (id: string, token: string, port: number | http.Server): CircleDisc;
    public execHook(embed: CircleDisc.IEmbed[], avatar: string, username: string): void;
    public on (event: "buildComplete", cb: (body: CircleDisc.IAppVeyorRes, type: "AppVeyor") => void): this;
    public on (event: "buildComplete", cb: (body: CircleDisc.ICircleCIRes, type: "CircleCI") => void): this;
    public on (event: "webhookSent", cb: (chunk: Buffer) => void): this;
}

declare namespace CircleDisc {

    export interface IEmbed {
        title: string;
        url: string;
        description: string;
        color: string;
        author: {
            name: string;
            url?: string;
        }
    }

    export interface IAppVeyorArtifact extends Object {
        fileName: string;
        name: string;
        type: string;
        size: number;
        url: string;
    }

    export interface IAppVeyorCompilationMessage extends Object {
        category: string;
        message: string;
        details: string;
        fileName: string;
        line: number;
        column: number;
        projectName: string;
        projectFileName: string;
        created: string;
    }

    export interface IAppVeyorJob extends Object {
        id: string;
        name: string;
        passed: boolean;
        failed: boolean;
        status: string;
        started: string;
        finished: string;
        duration: string;
        messages: string[];
        compilationMessages: IAppVeyorCompilationMessage[];
        artifacts: IAppVeyorArtifact[];
    }

    export interface IAppVeyorEventData extends Object {
        passed: boolean;
        failed: boolean;
        status: string;
        started: string;
        finished: string;
        duration: string;
        projectId: number;
        projectName: string;
        buildId: number;
        buildNumber: number;
        buildVersion: string;
        repositoryProvider: string;
        repositoryScm: string;
        repositoryName: string;
        branch: string;
        commitId: string;
        commitAuthor: string;
        commitAuthorEmail: string;
        commitDate: string;
        commitMessage: string;
        committerName: string;
        committerEmail: string;
        isPullRequest: boolean;
        pullRequestId: number;
        buildUrl: string;
        notificationSettingsUrl: string;
        messages: string[];
        jobs: IAppVeyorJob[];
    }

    export interface IAppVeyorRes extends Object {
        eventName: string;
        eventData: IAppVeyorEventData;
    }

    export interface ICircleCIStepAction extends Object {
        bash_command: string;
        run_time_millis: number;
        continue?: boolean | null;
        parallel?: boolean;
        start_time: string;
        name: string;
        messages?: string[];
        step?: number;
        exit_code: number;
        end_time: string;
        index: number;
        status: string;
        timedout?: boolean | null;
        infrastructure_fail?: boolean | null;
        type: string;
        source?: string;
        failed?: boolean | null;
    }

    export interface ICircleCIStep extends Object {
        name: string;
        actions: ICircleCIStepAction[];
    }

    export interface ICircleCIPayload extends Object {
        vcs_url: string;
        build_url: string;
        build_num: number;
        branch: string;
        vcs_revision: string;
        committer_name: string;
        committer_email: string;
        subject: string;
        body: string;
        why: string;
        dont_build: string | null;
        queued_at: string;
        start_time: string;
        stop_time: string;
        build_time_millis: number;
        username: string;
        reponame: string;
        lifecycle: string;
        outcome: string;
        status: string;
        retry_of: number | null;
        steps: ICircleCIStep[];
    }

    export interface ICircleCIRes extends Object {
        payload: ICircleCIPayload
    }
}